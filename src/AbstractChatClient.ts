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
    NewEmoticon,
    Bans,
    GetBans,
    Ban,
    Unban,
    Kick,
    ClientData,
    GetClientData,
    SetClientData,
    GetRoomSummary,
    GetSpaceSummary,
    RoomSummaryEvent,
    SpaceSummaryEvent,
    UpdateSpaceMember,
    Relationships,
    RelationshipDeleted,
    NewRelationship,
    DeleteRelationship,
    CreateRelationship,
    RoomSummaryUpdated,
    Pong,
    Ping,
    RedactMessages,
    MessagesRedacted,
    ReportAbuse,
    UpdateRoomMember,
    GetRelationships,
} from "./types/src";
import {EventTarget} from "./EventTarget";

type ArrayOfPromiseResolvers = [(value: any) => void, (reason?: any) => void];
type ExtraEventMap = Record<string, any>;

type CommandDefinition<RequestT, ResponseT> = {
    request: RequestT;
    response: ResponseT;
};

export abstract class AbstractChatClient<AdditionalEvents extends ExtraEventMap = {}> extends EventTarget<EventsMap & AdditionalEvents> {
     protected awaitingResponse: Map<string, ArrayOfPromiseResolvers> = new Map<string, ArrayOfPromiseResolvers>();
     protected sentCounter: number = 0;

    public abstract send<CommandType extends keyof CommandsMap>
        (commandType: CommandType, commandData: CommandRequest<CommandType>): Promise<CommandResult<CommandResponse<CommandType>>>;

    protected createEnvelope<CommandT>(type: string, data: CommandT): Envelope<CommandT> {
        return {
            type, data, ref: (++this.sentCounter).toString()
        };
    }

    protected createPromiseFromCommandEnvelope
        <CommandT extends keyof CommandsMap>(envelope: Envelope<CommandRequest<CommandT>>):
        Promise<CommandResult<CommandResponse<CommandT>>> {
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
        this.awaitingResponse.get(envelope.ref)[1](error);
        this.awaitingResponse.delete(envelope.ref);
    }
}

export type CommandResult<ResultT> = {data?: ResultT, error?: ErrorType};
export type CommandRequest<CommandType extends keyof CommandsMap> = CommandsMap[CommandType]['request'];
export type CommandResponse<CommandType extends keyof CommandsMap> = CommandsMap[CommandType]['response'];

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
    ClientData: ClientData,
    NewRelationship: NewRelationship,
    RelationshipDeleted: RelationshipDeleted,
    Relationships: Relationships,
    Pong: Pong,
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
    SpaceSummaryEvent: SpaceSummaryEvent,
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
    RoomSummaryEvent: RoomSummaryEvent,
    RoomSummaryUpdated: RoomSummaryUpdated,
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
    MessagesRedacted: MessagesRedacted,
};

/**
 * Map of commands and their corresponding events.
 */
export type CommandsMap = {
     // General commands
    GetSession: CommandDefinition<GetSession, EventsMap['Session']>,
    SetPermissionOverwrites: CommandDefinition<SetPermissionOverwrites, EventsMap['PermissionOverwritesUpdated']>,
    GetPermissionOverwrites: CommandDefinition<GetPermissionOverwrites, EventsMap['PermissionOverwrites']>,
    GetComputedPermissions: CommandDefinition<GetComputedPermissions, EventsMap['Permissions']>,
    GetPermissionOverwriteTargets: CommandDefinition<GetPermissionOverwriteTargets, EventsMap['PermissionOverwriteTargets']>,
    GetOwners: CommandDefinition<GetOwners, EventsMap['Owners']>,
    CreateOwner: CommandDefinition<CreateOwner, EventsMap['Owners']>,
    DeleteOwner: CommandDefinition<CreateOwner, EventsMap['Owners']>,
    CreateEmoticon: CommandDefinition<CreateEmoticon, EventsMap['NewEmoticon']>,
    DeleteEmoticon: CommandDefinition<DeleteEmoticon, EventsMap['EmoticonDeleted']>,
    GetEmoticons: CommandDefinition<GetEmoticons, EventsMap['Emoticons']>,
    GetBans: CommandDefinition<GetBans, EventsMap['Bans']>,
    Ban: CommandDefinition<Ban, EventsMap['Ok']>,
    Unban: CommandDefinition<Unban, EventsMap['Ok']>,
    Kick: CommandDefinition<Kick, EventsMap['Ok']>,
    GetClientData: CommandDefinition<GetClientData, EventsMap['ClientData']>,
    SetClientData: CommandDefinition<SetClientData, EventsMap['Ok']>,
    DeleteRelationship: CommandDefinition<DeleteRelationship, EventsMap['RelationshipDeleted']>,
    CreateRelationship: CommandDefinition<CreateRelationship, EventsMap['NewRelationship']>,
    GetRelationships: CommandDefinition<GetRelationships, EventsMap['Relationships']>,
    Ping: CommandDefinition<Ping, EventsMap['Pong']>,
    ReportAbuse: CommandDefinition<ReportAbuse, EventsMap['Ok']>,
     // Space commands
    GetDiscoverableSpaces: CommandDefinition<GetDiscoverableSpaces, EventsMap['DiscoverableSpaces']>,
    JoinSpace: CommandDefinition<JoinSpace, EventsMap['SpaceJoined']>,
    LeaveSpace: CommandDefinition<LeaveSpace, EventsMap['SpaceLeft']>,
    CreateSpace: CommandDefinition<CreateSpace, EventsMap['SpaceJoined']>,
    UpdateSpace: CommandDefinition<UpdateSpace, EventsMap['SpaceUpdated']>,
    DeleteSpace: CommandDefinition<DeleteSpace, EventsMap['SpaceDeleted']>,
    GetSpaceMembers: CommandDefinition<GetSpaceMembers, EventsMap['SpaceMembers']>,
    GetSpaceRooms: CommandDefinition<GetSpaceRooms, EventsMap['SpaceRooms']>,
    CreateRole: CommandDefinition<CreateRole, EventsMap['NewRole']>,
    DeleteRole: CommandDefinition<DeleteRole, EventsMap['RoleDeleted']>,
    UpdateRole: CommandDefinition<UpdateRole, EventsMap['RoleUpdated']>,
    AssignRole: CommandDefinition<AssignRole, EventsMap['SpaceMemberUpdated'] | EventsMap['RoomMemberUpdated']>,
    DeassignRole: CommandDefinition<DeassignRole, EventsMap['SpaceMemberUpdated'] | EventsMap['RoomMemberUpdated']>,
    GetSpaceSummary: CommandDefinition<GetSpaceSummary, EventsMap['SpaceSummaryEvent']>,
    UpdateSpaceMember: CommandDefinition<UpdateSpaceMember, EventsMap['SpaceMemberUpdated']>,
     // Room commands
    JoinRoom: CommandDefinition<JoinRoom, EventsMap['RoomJoined']>,
    LeaveRoom: CommandDefinition<LeaveRoom, EventsMap['RoomLeft']>,
    CreateRoom: CommandDefinition<CreateRoom, EventsMap['RoomJoined']>,
    DeleteRoom: CommandDefinition<DeleteRoom, EventsMap['RoomDeleted']>,
    UpdateRoom: CommandDefinition<UpdateRoom, EventsMap['RoomUpdated']>,
    GetRoomMembers: CommandDefinition<GetRoomMembers, EventsMap['RoomMembers']>,
    GetRoomSummary: CommandDefinition<GetRoomSummary, EventsMap['RoomSummaryEvent']>,
    UpdateRoomMember: CommandDefinition<UpdateRoomMember, EventsMap['RoomMemberUpdated']>,
     // Topic commands
    CreateTopic: CommandDefinition<CreateTopic, EventsMap['NewTopic']>,
    DeleteTopic: CommandDefinition<DeleteTopic, EventsMap['TopicDeleted']>,
    CreateMessage: CommandDefinition<CreateMessage, EventsMap['NewMessage']>,
    Ack: CommandDefinition<Ack, EventsMap['FollowedTopicUpdated'] | EventsMap['Ok']>,
    FollowTopic: CommandDefinition<FollowTopic, EventsMap['TopicFollowed']>,
    UnfollowTopic: CommandDefinition<UnfollowTopic, EventsMap['TopicUnfollowed']>,
    GetFollowedTopics: CommandDefinition<GetFollowedTopics, EventsMap['FollowedTopics']>,
    GetMessages: CommandDefinition<GetMessages, EventsMap['Messages']>,
    GetTopics: CommandDefinition<GetTopics, EventsMap['Topics']>,
    UpdateTopic: CommandDefinition<UpdateTopic, EventsMap['TopicUpdated']>,
    RedactMessages: CommandDefinition<RedactMessages, EventsMap['MessagesRedacted']>,
 }
