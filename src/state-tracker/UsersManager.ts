import {ChatStateTracker} from "./ChatStateTracker";
import {ObservableIndexedObjectCollection} from "../IndexedObjectCollection";
import {RoomMember, Session, SpaceMember, User} from "../types/src";
import {extractUserFromMember} from "./functions";

export class UsersManager {
    private readonly users: ObservableIndexedObjectCollection<User> = new ObservableIndexedObjectCollection('id');

    public constructor(private tracker: ChatStateTracker) {
        // RoomMemberUpdated & SpaceMemberUpdated events are not contains user object
        tracker.client.on('UserUpdated', event => this.handleUsers([event.user]));
        tracker.client.on('RoomMemberJoined', event => this.handleMembers([event.member]));
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
        this.users.set(...members.map(extractUserFromMember));
    }

    private handleUsers(users: User[]): void {
        this.users.set(...users);
    }

    private handleSession(session: Session): void {
        this.users.deleteAll();
        this.users.set(session.user);
    }
}