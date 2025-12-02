import {IndexedCollection, ObservableIndexedObjectCollection} from "../IndexedObjectCollection";
import {
    NewMessage,
    NewTopic,
    Room, RoomDeleted,
    RoomJoined, RoomLeft,
    RoomMember, RoomMemberJoined, RoomMemberLeft, RoomMembers,
    RoomMemberUpdated, RoomUpdated, Session, SpaceDeleted, SpaceLeft, SpaceMemberLeft,
    SpaceMemberUpdated,
    Topic,
    TopicDeleted, TopicUpdated,
    UserUpdated,
} from "../types/src";
import {ChatStateTracker} from "./ChatStateTracker";
import {DeferredTask, PromiseRegistry} from "./AsyncUtils";
import {MessagesManager} from "./MessagesManager";

export class RoomsManager {
    public readonly messages: MessagesManager;

    private readonly list = new ObservableIndexedObjectCollection<Room>('id');
    private readonly topics = new IndexedCollection<string, ObservableIndexedObjectCollection<Topic>>();
    private readonly members = new IndexedCollection<string, ObservableIndexedObjectCollection<RoomMember>>();
    private readonly deferredSession = new DeferredTask();
    private readonly membersPromises = new PromiseRegistry();
    private readonly topicsPromises = new PromiseRegistry();

    public constructor(private tracker: ChatStateTracker) {
        this.messages = new MessagesManager(tracker);

        this.tracker.client.on('NewMessage', ev => this.handleNewMessage(ev));
        this.tracker.client.on('NewTopic', ev => this.handleNewTopic(ev));
        this.tracker.client.on('TopicDeleted', ev => this.handleTopicDeleted(ev));
        this.tracker.client.on('RoomJoined', ev => this.handleRoomJoined(ev));
        this.tracker.client.on('RoomLeft', ev => this.handleRoomLeft(ev));
        this.tracker.client.on('RoomUpdated', ev => this.handleRoomUpdated(ev));
        this.tracker.client.on('RoomDeleted', ev => this.handleRoomDeleted(ev));
        this.tracker.client.on('TopicUpdated', ev => this.handleTopicUpdated(ev));
        this.tracker.client.on('RoomMemberJoined', ev => this.handleRoomMemberJoined(ev));
        this.tracker.client.on('RoomMemberLeft', ev => this.handleRoomMemberLeft(ev));
        this.tracker.client.on('RoomMembers', ev => this.handleRoomMembers(ev));
        this.tracker.client.on('RoomMemberUpdated', ev => this.handleRoomMemberUpdated(ev));
        this.tracker.client.on('SpaceMemberLeft', ev => this.handleSpaceMemberLeft(ev));
        this.tracker.client.on('SpaceMemberUpdated', ev => this.handleSpaceMemberUpdated(ev));
        this.tracker.client.on('SpaceDeleted', ev => this.handleSpaceDeleted(ev));
        this.tracker.client.on('SpaceLeft', ev => this.handleSpaceDeleted(ev));
        this.tracker.client.on('UserUpdated', ev => this.handleUserUpdated(ev));
        this.tracker.client.on('Session', ev => this.handleSession(ev));
    }

    /**
     * Get collection of room members.
     */
    public async getMembers(roomId: string): Promise<ObservableIndexedObjectCollection<RoomMember> | undefined> {
        if (this.membersPromises.notExist(roomId)) {
            this.membersPromises.registerByFunction(async () => {
                const result = await this.tracker.client.send('GetRoomMembers', {id: roomId});
                if (result.error) {
                    throw result.error;
                }
                this.handleRoomMembers(result.data);
            }, roomId);
        }

        await this.membersPromises.get(roomId);
        return this.members.get(roomId);
    }

    /**
     * Get a room member representing the current user.
     */
    public async getMe(roomId: string): Promise<RoomMember | undefined> {
        const userId = (await this.tracker.getMe()).id;

        if (! this.list.has(roomId)) {
            // User is not in passed room.
            return undefined;
        }

        const members = await this.getMembers(roomId);
        return members?.items.find(member => (member.user?.id ?? member.spaceMember.user.id) === userId);
    }

    /**
     * Get collection of all the rooms you are in.
     */
    public async get(): Promise<ObservableIndexedObjectCollection<Room>> {
        await this.deferredSession.promise;
        return this.list;
    }

    /**
     * Get a collection of locally cached Topic objects for given room.
     * You can pass topic ids as second argument, to try to fetch them from the server.
     */
    public async getTopics(roomId: string, tryToFetchTopicIds?: string[]): Promise<ObservableIndexedObjectCollection<Topic> | undefined> {
        await this.deferredSession.promise;

        if (tryToFetchTopicIds?.length) {
            // Topic can be fetched if it isn't already cached and fetch is not already in progress
            const canFetch = (topicId: string) => ! this.topics.get(roomId)?.has(topicId) && ! this.topicsPromises.has(roomId + topicId);
            const idsToFetch = tryToFetchTopicIds.filter(canFetch);

            if (idsToFetch.length) {
                const promise = this.tracker
                    .client
                    .send('GetTopics', {roomId, topicIds: idsToFetch})
                    .then(result => this.topics.get(result.data.location.roomId)?.set(...result.data.topics));

                idsToFetch.forEach(topicId => this.topicsPromises.register(promise, roomId + topicId));
            }

            for (const topicId of tryToFetchTopicIds) {
                await this.topicsPromises.get(roomId + topicId);
            }
        }

        return this.topics.get(roomId);
    }

    private deleteRoom(...roomIds: string[]): void {
        this.list.delete(...roomIds);
        this.members.delete(...roomIds);
        this.membersPromises.forget(...roomIds);

        for (const roomId of roomIds) {
            const topicIds: string[] = this.topics.get(roomId)?.items.map(topic => topic.id) ?? [];
            this.messages._deleteByTopicIds(roomId, ...topicIds);
        }

        this.topics.delete(...roomIds);
    }

    private deleteRoomsBySpaceId(spaceId: string): void {
        this.deleteRoom(
            ...this.list.findBy('spaceId', spaceId).items.map(room => room.id)
        );
    }

    private handleSpaceMemberUpdated(ev: SpaceMemberUpdated): void {
        // Update members of rooms related to this space
        for (const room of this.list.findBy('spaceId', ev.spaceId).items) {
            const roomMembers = this.members.get(room.id);

            if (! roomMembers || ! roomMembers.has(ev.userId)) {
                // Skip update if member list for this room is not loaded
                // or user is not in room
                continue;
            }

            const roomMember = roomMembers.get(ev.userId);
            const user = roomMember.spaceMember.user;

            // Update space member but first fill user object (it's null in event object)
            roomMember.spaceMember = {...ev.member, user};
            roomMembers.set(roomMember);
        }
    }

    private handleSpaceMemberLeft(ev: SpaceMemberLeft): void {
        this.list
            .findBy('spaceId', ev.spaceId).items
            .forEach(room => this.members.get(room.id)?.delete(ev.userId));
    }

    private handleRoomMemberUpdated(ev: RoomMemberUpdated): void {
        if (! this.members.has(ev.roomId)) {
            // We do not track member list for this room.
            return;
        }

        const members = this.members.get(ev.roomId);
        const member = members.get(ev.userId);
        const newMember = ev.member;
        const user = member.spaceMember?.user ?? member.user;

        // Preserving user object, because it's not included in event
        if (newMember.spaceMember) {
            newMember.spaceMember.user = user;
        } else {
            newMember.user = user;
        }

        members.set(newMember);
    }

    private handleSpaceDeleted(ev: SpaceDeleted | SpaceLeft): void {
        this.deleteRoomsBySpaceId(ev.id);
    }

    private handleTopicDeleted(ev: TopicDeleted): void {
        const collection = this.topics.get(ev.location.roomId);
        collection.delete(ev.location.topicId);

        const room = this.list.get(ev.location.roomId);
        if (room.defaultTopic?.id === ev.location.topicId) {
            this.list.set({...room, defaultTopic: null});
        }
    }

    private handleNewTopic(ev: NewTopic): void {
        this.addJoinedRoomTopics(ev.roomId, ev.topic);
    }

    private addJoinedRoomTopics(roomId: string, ...topics: Topic[]): void {
        if (this.topics.has(roomId)) {
            this.topics.get(roomId).set(...topics);
        } else {
            this.topics.set([roomId, new ObservableIndexedObjectCollection<Topic>('id', topics)]);
        }
    }

    private handleRoomJoined(ev: RoomJoined): void {
        this.addJoinedRooms(ev.room);
    }

    private handleRoomUpdated(ev: RoomUpdated): void {
        if (this.list.has(ev.room.id)) {
            this.list.set(ev.room);
        }
    }

    private handleRoomDeleted(ev: RoomDeleted): void {
        this.deleteRoom(ev.id);
    }

    private handleTopicUpdated(ev: TopicUpdated): void {
        const room = this.list.get(ev.location.roomId);

        if (this.topics.get(ev.location.roomId)?.has(ev.topic.id)) {
            this.topics.get(ev.location.roomId).set(ev.topic);
        }

        if (room.defaultTopic.id === ev.topic.id) {
            room.defaultTopic = ev.topic;
            this.list.set(room);
        }
    }

    private addJoinedRooms(...rooms: Room[]): void {
        for (const room of rooms) {
            if (room.defaultTopic) {
                this.addJoinedRoomTopics(room.id, room.defaultTopic);
            }

            if (room.type === 'Pm' && room.recipients) {
                // Treat PM recipients as normal room members.
                // We are registering fake promise in `memberPromises`
                // because GetMembers are not supported for PM rooms.
                this.handleRoomMembers({
                    id: room.id,
                    members: room.recipients.map(user => ({
                        user,
                        spaceMember: null,
                        roles: null,
                        customColor: null,
                        customNick: null,
                        extras: '',
                    })),
                });
                this.membersPromises.register(Promise.resolve(), room.id);
            }
        }
        this.list.set(...rooms);
    }

    private handleRoomLeft(ev: RoomLeft): void {
        this.deleteRoom(ev.id);
    }

    private handleRoomMemberJoined(ev: RoomMemberJoined): void {
        if (this.members.has(ev.roomId)) {
            this.members.get(ev.roomId).set(ev.member);
        }
    }

    private handleRoomMemberLeft(ev: RoomMemberLeft): void {
        if (this.members.has(ev.roomId)) {
            this.members.get(ev.roomId).delete(ev.userId);
        }
    }

    private handleRoomMembers(ev: RoomMembers): void {
        if (! this.members.has(ev.id)) {
            this.members.set([
                ev.id,
                new ObservableIndexedObjectCollection(
                    member => member.user?.id ?? member.spaceMember.user.id,
                    ev.members,
                )
            ]);
        }
    }

    private handleSession(ev: Session): void {
        this.list.deleteAll();
        this.topics.deleteAll();
        this.topicsPromises.forgetAll();
        this.members.deleteAll();
        this.membersPromises.forgetAll();

        this.addJoinedRooms(...ev.state.rooms);

        this.deferredSession.resolve();
    }

    private handleUserUpdated(ev: UserUpdated): void {
        // Update room members users
        this.members.items.forEach((members) => {
            const member = members.get(ev.user.id);

            if (! member) {
                // Skip room; updated user is not here
                return;
            }

            const newMember: RoomMember = {...member};

            if (member.user) {
                newMember.user = ev.user;
            } else {
                newMember.spaceMember.user = ev.user;
            }

            members.set(newMember);
        });

        // Update recipients users
        const newRooms: Room[] = [];
        this.list.items.forEach(room => {
            if (room.recipients?.some(user => user.id === ev.user.id)) {
                room.recipients = room.recipients.map(user => user.id === ev.user.id ? ev.user : user);
                newRooms.push({...room});
            }
        });
        this.list.set(...newRooms);
    }

    private handleNewMessage(ev: NewMessage): void {
        const topics = this.topics.get(ev.message.location.roomId);
        const topic = topics?.get(ev.message.location.topicId);

        if (!topic) {
            return; // No topic found, nothing to update
        }

        const newTopic = {
            ...topic,
            messageCount: topic.messageCount + 1,
            lastMessage: ev.message,
        };

        topics.set(newTopic);
        const room = this.list.get(ev.message.location.roomId);

        if (room.defaultTopic?.id === ev.message.location.topicId) {
            this.list.set({ ...room, defaultTopic: newTopic });
        }
    }
}