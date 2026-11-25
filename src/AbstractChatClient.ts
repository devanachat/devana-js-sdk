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
    RoomMembersJoined,
    RoomMembers,
    NewRoom,
    NewTopic,
    TopicDeleted,
    NewMessage,
    GetPermissionOverwrites,
    GetComputedPermissions,
    ComputedPermissions,
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
    GetIgnoredRooms,
    IgnoredRooms,
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
    FollowedTopics,
    FollowTopic,
    UpdateFollowedTopic,
    GetFollowedTopics,
    Messages,
    GetMessages,
    SearchMessages,
    FoundMessages,
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
    UpdateMessage,
    MessageUpdated,
    SearchGifs,
    GetGifCategories,
    FoundGifs,
    GifCategories,
    ReportAbuse,
    UpdateRoomMember,
    GetRelationships,
    GetUserInfo,
    UserInfo,
    SetSessionData,
    SessionData,
    GetSessionData,
    SetUserData,
    UserData,
    GetUserData,
    UnfollowTopic,
    TopicUnfollowed,
    Invite,
    Uninvite,
    GetInvited,
    Invited,
    React,
    Interact,
    AckInteraction,
    Unreact,
    GetReactionDetails,
    ReactionUpdated,
    Reacted,
    NewInteraction,
    Interacted,
    InteractionResolved,
    ReactionDetails,
    Type,
    Typing,
    GetEntitlements,
    Entitlements,
    EntitlementUsage,
    CreateAccessTicket,
    AccessTicket,
    JoinCall,
    DeclineCall,
    InviteToCall,
    MuteCallMember,
    KickCallMember,
    UpdateCallMember,
    GetCallMembers,
    CallJoined,
    CallUpdated,
    IncomingCallUpdated,
    CallVideoLimitReached,
    CallMembers,
    CallMemberJoined,
    CallMemberUpdated,
    CallMemberLeft,
    GetActivities,
    UpdateActivity,
    Activities,
    NewActivity,
    ActivityUpdated,
    ActivityDeleted,
} from "./protocol";
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

    /**
     * Reject every command that is still waiting for a response.
     * Call this whenever the transport can no longer deliver an answer (the
     * connection dropped).
     */
    protected failAwaitingResponses(error: any): void {
        if (! this.awaitingResponse.size) {
            return;
        }

        const pending = Array.from(this.awaitingResponse.values());
        this.awaitingResponse.clear();

        for (const [, reject] of pending) {
            reject(error);
        }
    }
}

/**
 * The answer to a command: either `data` or the server `error`, never both.
 * Check `error` first and TypeScript knows `data` is there.
 */
export type CommandResult<ResultT> =
    | {data: ResultT, error: null}
    | {data: null, error: ErrorType};
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
    ComputedPermissions: ComputedPermissions,
    PermissionOverwrites: PermissionOverwrites,
    PermissionOverwritesUpdated: PermissionOverwritesUpdated,
    PermissionOverwriteTargets: PermissionOverwriteTargets,
    Owners: Owners,
    NewEmoticon: NewEmoticon,
    EmoticonDeleted: EmoticonDeleted,
    Emoticons: Emoticons,
    Bans: Bans,
    ClientData: ClientData,
    SessionData: SessionData,
    UserData: UserData,
    NewRelationship: NewRelationship,
    RelationshipDeleted: RelationshipDeleted,
    Relationships: Relationships,
    Pong: Pong,
    UserInfo: UserInfo,
    Entitlements: Entitlements,
    EntitlementUsage: EntitlementUsage,
    AccessTicket: AccessTicket,
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
    RoomMembersJoined: RoomMembersJoined,
    RoomMemberLeft: RoomMemberLeft,
    RoomMemberUpdated: RoomMemberUpdated,
    RoomMembers: RoomMembers,
    IgnoredRooms: IgnoredRooms,
    NewRoom: NewRoom,
    RoomDeleted: RoomDeleted,
    RoomUpdated: RoomUpdated,
    RoomSummaryEvent: RoomSummaryEvent,
    RoomSummaryUpdated: RoomSummaryUpdated,
    Invited: Invited,
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
    FoundMessages: FoundMessages,
    Topics: Topics,
    TopicUpdated: TopicUpdated,
    MessagesRedacted: MessagesRedacted,
    MessageUpdated: MessageUpdated,
    FoundGifs: FoundGifs,
    GifCategories: GifCategories,
    ReactionUpdated: ReactionUpdated,
    Reacted: Reacted,
    NewInteraction: NewInteraction,
    Interacted: Interacted,
    InteractionResolved: InteractionResolved,
    ReactionDetails: ReactionDetails,
    Typing: Typing,
    // Call events
    CallJoined: CallJoined,
    CallUpdated: CallUpdated,
    IncomingCallUpdated: IncomingCallUpdated,
    CallVideoLimitReached: CallVideoLimitReached,
    CallMembers: CallMembers,
    CallMemberJoined: CallMemberJoined,
    CallMemberUpdated: CallMemberUpdated,
    CallMemberLeft: CallMemberLeft,
    // Activity events
    Activities: Activities,
    NewActivity: NewActivity,
    ActivityUpdated: ActivityUpdated,
    ActivityDeleted: ActivityDeleted,
};

/**
 * Map of commands and their corresponding events.
 */
export type CommandsMap = {
     // General commands
    GetSession: CommandDefinition<GetSession, EventsMap['Session']>,
    SetPermissionOverwrites: CommandDefinition<SetPermissionOverwrites, EventsMap['PermissionOverwritesUpdated']>,
    GetPermissionOverwrites: CommandDefinition<GetPermissionOverwrites, EventsMap['PermissionOverwrites']>,
    GetComputedPermissions: CommandDefinition<GetComputedPermissions, EventsMap['ComputedPermissions']>,
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
    GetUserInfo: CommandDefinition<GetUserInfo, EventsMap['UserInfo']>,
    GetSessionData: CommandDefinition<GetSessionData, EventsMap['SessionData']>,
    SetSessionData: CommandDefinition<SetSessionData, EventsMap['Ok']>,
    GetUserData: CommandDefinition<GetUserData, EventsMap['UserData']>,
    SetUserData: CommandDefinition<SetUserData, EventsMap['Ok']>,
    GetEntitlements: CommandDefinition<GetEntitlements, EventsMap['Entitlements']>,
    CreateAccessTicket: CommandDefinition<CreateAccessTicket, EventsMap['AccessTicket']>,
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
    GetIgnoredRooms: CommandDefinition<GetIgnoredRooms, EventsMap['IgnoredRooms']>,
    CreateRoom: CommandDefinition<CreateRoom, EventsMap['RoomJoined']>,
    DeleteRoom: CommandDefinition<DeleteRoom, EventsMap['RoomDeleted']>,
    UpdateRoom: CommandDefinition<UpdateRoom, EventsMap['RoomUpdated']>,
    GetRoomMembers: CommandDefinition<GetRoomMembers, EventsMap['RoomMembers']>,
    GetRoomSummary: CommandDefinition<GetRoomSummary, EventsMap['RoomSummaryEvent']>,
    UpdateRoomMember: CommandDefinition<UpdateRoomMember, EventsMap['RoomMemberUpdated']>,
    Invite: CommandDefinition<Invite, EventsMap['Invited']>,
    Uninvite: CommandDefinition<Uninvite, EventsMap['Invited']>,
    GetInvited: CommandDefinition<GetInvited, EventsMap['Invited']>,
     // Topic commands
    CreateTopic: CommandDefinition<CreateTopic, EventsMap['NewTopic']>,
    DeleteTopic: CommandDefinition<DeleteTopic, EventsMap['TopicDeleted']>,
    /** `Ok` for an ephemeral message (`ephemeralFor`), which goes to its recipient alone. */
    CreateMessage: CommandDefinition<CreateMessage, EventsMap['NewMessage'] | EventsMap['Ok']>,
    Ack: CommandDefinition<Ack, EventsMap['FollowedTopicUpdated'] | EventsMap['Ok']>,
    FollowTopic: CommandDefinition<FollowTopic, EventsMap['TopicFollowed']>,
    UnfollowTopic: CommandDefinition<UnfollowTopic, EventsMap['TopicUnfollowed']>,
    UpdateFollowedTopic: CommandDefinition<UpdateFollowedTopic, EventsMap['FollowedTopicUpdated']>,
    GetFollowedTopics: CommandDefinition<GetFollowedTopics, EventsMap['FollowedTopics']>,
    GetMessages: CommandDefinition<GetMessages, EventsMap['Messages']>,
    SearchMessages: CommandDefinition<SearchMessages, EventsMap['FoundMessages']>,
    GetTopics: CommandDefinition<GetTopics, EventsMap['Topics']>,
    UpdateTopic: CommandDefinition<UpdateTopic, EventsMap['TopicUpdated']>,
    RedactMessages: CommandDefinition<RedactMessages, EventsMap['MessagesRedacted']>,
    /** Resolves with `Ok` when the edit changes nothing. */
    UpdateMessage: CommandDefinition<UpdateMessage, EventsMap['MessageUpdated'] | EventsMap['Ok']>,
    /** Available when the server runs GIF search; featured GIFs without a query. */
    SearchGifs: CommandDefinition<SearchGifs, EventsMap['FoundGifs']>,
    GetGifCategories: CommandDefinition<GetGifCategories, EventsMap['GifCategories']>,
    React: CommandDefinition<React, EventsMap['Reacted']>,
    Interact: CommandDefinition<Interact, EventsMap['Interacted']>,
    AckInteraction: CommandDefinition<AckInteraction, EventsMap['Ok']>,
    /** `Ok` when the user had no such reaction. */
    Unreact: CommandDefinition<Unreact, EventsMap['Reacted'] | EventsMap['Ok']>,
    GetReactionDetails: CommandDefinition<GetReactionDetails, EventsMap['ReactionDetails']>,
    Type: CommandDefinition<Type, EventsMap['Ok']>,
     // Call commands
    JoinCall: CommandDefinition<JoinCall, EventsMap['CallJoined']>,
    DeclineCall: CommandDefinition<DeclineCall, EventsMap['Ok']>,
    InviteToCall: CommandDefinition<InviteToCall, EventsMap['Ok']>,
    MuteCallMember: CommandDefinition<MuteCallMember, EventsMap['Ok']>,
    KickCallMember: CommandDefinition<KickCallMember, EventsMap['Ok']>,
    UpdateCallMember: CommandDefinition<UpdateCallMember, EventsMap['Ok']>,
    GetCallMembers: CommandDefinition<GetCallMembers, EventsMap['CallMembers']>,
    GetActivities: CommandDefinition<GetActivities, EventsMap['Activities']>,
    UpdateActivity: CommandDefinition<UpdateActivity, EventsMap['ActivityUpdated']>,
 }
