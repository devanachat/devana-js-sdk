import {ChatStateTracker} from "./ChatStateTracker";
import {ObservableIndexedObjectCollection} from "../IndexedObjectCollection";
import {RoomMember, Session, SpaceMember, User} from "../types/src";
import {extractUserFromMember} from "./functions";
import {EventTarget} from "../EventTarget";

export class UsersManager {
    public readonly onlineStatus = new EventTarget<{ change: User }>();

    private readonly users: ObservableIndexedObjectCollection<User> = new ObservableIndexedObjectCollection('id');

    public constructor(private tracker: ChatStateTracker) {
        // RoomMemberUpdated & SpaceMemberUpdated events are not contains user object
        tracker.client.on('UserUpdated', event => this.handleUsers([event.user]));
        tracker.client.on('RoomMembersJoined', event => this.handleMembers(event.members));
        tracker.client.on('SpaceMemberJoined', event => this.handleMembers([event.member]));
        tracker.client.on('SpaceMembers', event => this.handleMembers(event.members));
        tracker.client.on('RoomMembers', event => this.handleMembers(event.members));
        tracker.client.on('Messages', event => this.handleUsers(event.messages.map(message => message.author.user)));
        tracker.client.on('NewMessage', event => this.handleUsers([event.message.author.user]));
        tracker.client.on('Session', event => this.handleSession(event));
    }

    /**
     * Get all available (cached) user objects at once.
     */
    public async getAvailable(): Promise<ObservableIndexedObjectCollection<User>> {
        return this.users;
    }

    private handleMembers(members: (RoomMember | SpaceMember)[]): void {
        this.handleUsers(members.map(extractUserFromMember));
    }

    private handleSession(session: Session): void {
        // Keep the "seen users" cache across reconnects so bound user lists do
        // not blank out; just ensure our own user is present/updated. Stale
        // entries are refreshed as member/message collections refetch.
        this.handleUsers([session.user]);
    }

    /**
     * Every message carries its author, so most of what arrives here is already known - only the users that actually
     * changed are stored, and the collection does not report a change for each message.
     */
    private handleUsers(users: User[]): void {
        const changedUsers: User[] = [];

        for (const newUser of users) {
            const oldUser = this.users.get(newUser.id);

            if (oldUser && isSameUser(oldUser, newUser)) {
                continue;
            }

            if (oldUser && oldUser.status !== newUser.status) {
                this.onlineStatus.emit('change', newUser);
            }

            changedUsers.push(newUser);
        }

        this.users.set(...changedUsers);
    }
}

function isSameUser(a: User, b: User): boolean {
    const keys = Object.keys(a) as (keyof User)[];

    if (keys.length !== Object.keys(b).length) {
        return false;
    }

    return keys.every(key => {
        const valueA = a[key];
        const valueB = b[key];

        if (Array.isArray(valueA) && Array.isArray(valueB)) {
            return valueA.length === valueB.length && valueA.every((item, index) => item === valueB[index]);
        }

        return valueA === valueB;
    });
}