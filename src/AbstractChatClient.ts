import {
    Bye,
    GetSession,
    JoinSpace,
    Session,
    SpaceJoined,
    Error as ErrorType,
    SpaceLeft,
    SpaceMemberJoined,
    SpaceMemberLeft,
    SpaceMemberUpdated,
    SpaceDeleted,
    SpaceMembers,
    SpaceRooms,
    NewRole,
    RoomDeleted,
    RoomJoined,
    RoomLeft,
    RoomMemberLeft,
    RoomMemberJoined,
    RoomMembers,
    NewRoom,
    NewTopic,
    TopicDeleted,
    NewMessage,
    GetPermissionOverwrites,
    GetComputedPermissions,
    LeaveSpace,
    CreateSpace,
    DeleteSpace,
    GetSpaceMembers,
    GetSpaceRooms,
    CreateRole,
    DeleteRole,
    AssignRole,
    DeassignRole,
    SetPermissionOverwrites,
    JoinRoom,
    LeaveRoom,
    CreateRoom,
    DeleteRoom,
    GetRoomMembers,
    CreateTopic,
    DeleteTopic,
    CreateMessage,
    Envelope,
    PermissionOverwrites,
    PermissionOverwritesUpdated,
    RoomMemberUpdated,
    UpdateRole,
    RoleUpdated,
    Ack,
    UserUpdated,
    UpdateRoom,
    RoomUpdated,
    UpdateSpace,
    SpaceUpdated,
    PermissionOverwriteTargets,
    GetPermissionOverwriteTargets,
    Owners,
    Ok,
    GetOwners,
    CreateOwner,
    RoleDeleted,
    FollowedTopicUpdated,
    TopicFollowed,
    TopicUnfollowed,
    FollowedTopics,
    FollowTopic,
    UnfollowTopic,
    GetFollowedTopics,
    Messages,
    GetMessages,
    Topics,
    GetTopics,
    TopicUpdated,
    UpdateTopic,
    GetDiscoverableSpaces,
    DiscoverableSpaces,
    CreateEmoticon,
    DeleteEmoticon,
    GetEmoticons,
    Emoticons,
    EmoticonDeleted,
    NewEmoticon, Bans, GetBans, Ban, Unban, Kick,
} from "./types/src/index";
import {EventTarget} from "./EventTarget";
import {ErrorObject} from "css-minimizer-webpack-plugin";

type ArrayOfPromiseResolvers = [(value: any) => void, (reason?: any) => void];

export abstract class AbstractChatClient extends EventTarget {
    protected awaitingResponse: Map<string, ArrayOfPromiseResolvers> = new Map<string, ArrayOfPromiseResolvers>();
    protected sentCounter: number = 0;

    public abstract send<CommandType extends keyof CommandsMap>
        (commandType: CommandType, commandData: CommandsMap[CommandType][0]): Promise<CommandResult<CommandsMap[CommandType][1]>>;

    public on<EventName extends keyof EventsMap>
        (eventName: EventName | string, handler: (event: EventsMap[EventName]) => void): this {
        return super.on(eventName, handler);
    }

    public once<EventName extends keyof EventsMap>
        (eventName: EventName, handler: (event: EventsMap[EventName]) => void): this {
        return super.once(eventName, handler);
    }

    protected createEnvelope<CommandT>(type: string, data: CommandT): Envelope<CommandT> {
        return {
            type, data, ref: (++this.sentCounter).toString()
        };
    }

    protected createPromiseFromCommandEnvelope
        <CommandT extends keyof CommandsMap>(envelope: Envelope<CommandsMap[CommandT][0]>):
        Promise<CommandResult<CommandsMap[CommandT][1]>> {
        return new Promise((...args) =>
            this.awaitingResponse.set(envelope.ref as string, args));
    }

    protected handleIncomingEnvelope(envelope: Envelope): void {
        if (!this.awaitingResponse.has(envelope.ref)) {
            return;
        }
        const isError = envelope.type === 'Error';
        this.awaitingResponse.get(envelope.ref)[0]({
            data: isError ? null : envelope.data,
            error: isError ? envelope.data : null,
        } as CommandResult<any>);
        this.awaitingResponse.delete(envelope.ref);
    }

    protected handleEnvelopeSendError(envelope: Envelope, error: any): void {
        if (!this.awaitingResponse.has(envelope.ref)) {
            return;
        }
        this.awaitingResponse.get(envelope.ref)[0](error);
        this.awaitingResponse.delete(envelope.ref);
    }
}

export type CommandResult<ResultT> = {data?: ResultT, error?: ErrorType};

/**
 * Map of incoming events.
 */
export type EventsMap = {
    // General Events
    Bye: Bye,
    Ok: Ok,
    Error: ErrorType,
    Session: Session,
    Permissions: Permissions,
    PermissionOverwrites: PermissionOverwrites,
    PermissionOverwritesUpdated: PermissionOverwritesUpdated,
    PermissionOverwriteTargets: PermissionOverwriteTargets,
    Owners: Owners,
    NewEmoticon: NewEmoticon,
    EmoticonDeleted: EmoticonDeleted,
    Emoticons: Emoticons,
    Bans: Bans,
    // Space events
    DiscoverableSpaces: DiscoverableSpaces,
    SpaceJoined: SpaceJoined,
    SpaceLeft: SpaceLeft,
    SpaceMemberJoined: SpaceMemberJoined,
    SpaceMemberLeft: SpaceMemberLeft,
    SpaceMemberUpdated: SpaceMemberUpdated,
    SpaceUpdated: SpaceUpdated,
    SpaceDeleted: SpaceDeleted,
    SpaceMembers: SpaceMembers,
    SpaceRooms: SpaceRooms,
    NewRole: NewRole,
    RoleDeleted: RoleDeleted,
    RoleUpdated: RoleUpdated,
    // Room events
    RoomJoined: RoomJoined,
    RoomLeft: RoomLeft,
    RoomMemberJoined: RoomMemberJoined,
    RoomMemberLeft: RoomMemberLeft,
    RoomMemberUpdated: RoomMemberUpdated,
    RoomMembers: RoomMembers,
    NewRoom: NewRoom,
    RoomDeleted: RoomDeleted,
    RoomUpdated: RoomUpdated,
    // Topic events
    NewTopic: NewTopic,
    TopicDeleted: TopicDeleted,
    NewMessage: NewMessage,
    UserUpdated: UserUpdated,
    TopicFollowed: TopicFollowed,
    TopicUnfollowed: TopicUnfollowed,
    FollowedTopics: FollowedTopics,
    FollowedTopicUpdated: FollowedTopicUpdated,
    Messages: Messages,
    Topics: Topics,
    TopicUpdated: TopicUpdated,
};

/**
 * Map of commands and their corresponding events.
 */
export type CommandsMap = {
    // General commands
    GetSession: [GetSession, EventsMap['Session']],
    SetPermissionOverwrites: [SetPermissionOverwrites, EventsMap['PermissionOverwritesUpdated']],
    GetPermissionOverwrites: [GetPermissionOverwrites, EventsMap['PermissionOverwrites']],
    GetComputedPermissions: [GetComputedPermissions, EventsMap['Permissions']],
    GetPermissionOverwriteTargets: [GetPermissionOverwriteTargets, EventsMap['PermissionOverwriteTargets']],
    GetOwners: [GetOwners, EventsMap['Owners']],
    CreateOwner: [CreateOwner, EventsMap['Owners']],
    DeleteOwner: [CreateOwner, EventsMap['Owners']],
    CreateEmoticon: [CreateEmoticon, EventsMap['NewEmoticon']],
    DeleteEmoticon: [DeleteEmoticon, EventsMap['EmoticonDeleted']],
    GetEmoticons: [GetEmoticons, EventsMap['Emoticons']],
    GetBans: [GetBans, EventsMap['Bans']],
    Ban: [Ban, EventsMap['Ok']],
    Unban: [Unban, EventsMap['Ok']],
    Kick: [Kick, EventsMap['Ok']],
    // Space commands
    GetDiscoverableSpaces: [GetDiscoverableSpaces, EventsMap['DiscoverableSpaces']],
    JoinSpace: [JoinSpace, EventsMap['SpaceJoined']],
    LeaveSpace: [LeaveSpace, EventsMap['SpaceLeft']],
    CreateSpace: [CreateSpace, EventsMap['SpaceJoined']],
    UpdateSpace: [UpdateSpace, EventsMap['SpaceUpdated']],
    DeleteSpace: [DeleteSpace, EventsMap['SpaceDeleted']],
    GetSpaceMembers: [GetSpaceMembers, EventsMap['SpaceMembers']],
    GetSpaceRooms: [GetSpaceRooms, EventsMap['SpaceRooms']],
    CreateRole: [CreateRole, EventsMap['NewRole']],
    DeleteRole: [DeleteRole, EventsMap['RoleDeleted']],
    UpdateRole: [UpdateRole, EventsMap['RoleUpdated']],
    AssignRole: [AssignRole, EventsMap['SpaceMemberUpdated'] | EventsMap['RoomMemberUpdated']],
    DeassignRole: [DeassignRole, EventsMap['SpaceMemberUpdated'] | EventsMap['RoomMemberUpdated']],
    // Room commands
    JoinRoom: [JoinRoom, EventsMap['RoomJoined']],
    LeaveRoom: [LeaveRoom, EventsMap['RoomLeft']],
    CreateRoom: [CreateRoom, EventsMap['NewRoom']],
    DeleteRoom: [DeleteRoom, EventsMap['RoomDeleted']],
    UpdateRoom: [UpdateRoom, EventsMap['RoomUpdated']],
    GetRoomMembers: [GetRoomMembers, EventsMap['RoomMembers']],
    // Topic commands
    CreateTopic: [CreateTopic, EventsMap['NewTopic']],
    DeleteTopic: [DeleteTopic, EventsMap['TopicDeleted']],
    CreateMessage: [CreateMessage, EventsMap['NewMessage']],
    Ack: [Ack, EventsMap['FollowedTopicUpdated'] | EventsMap['Ok']],
    FollowTopic: [FollowTopic, EventsMap['TopicFollowed']],
    UnfollowTopic: [UnfollowTopic, EventsMap['TopicUnfollowed']],
    GetFollowedTopics: [GetFollowedTopics, EventsMap['FollowedTopics']],
    GetMessages: [GetMessages, EventsMap['Messages']],
    GetTopics: [GetTopics, EventsMap['Topics']],
    UpdateTopic: [UpdateTopic, EventsMap['TopicUpdated']],
}