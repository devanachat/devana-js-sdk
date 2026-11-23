import {ChatStateTracker} from "./ChatStateTracker";
import {ObservableIndexedObjectCollection} from "../IndexedObjectCollection";
import {CommandRequest, CommandResponse, CommandsMap} from "../AbstractChatClient";
import {
    Call,
    CallJoined,
    CallMember,
    CallUpdated,
    IncomingCall,
    IncomingCallUpdated,
    RoomDeleted,
    RoomLeft,
    Session,
    SpaceDeleted,
    SpaceLeft,
} from "../protocol";

export class CallsManager {
    private readonly list = new ObservableIndexedObjectCollection<Call>(call => call.location.roomId);
    private readonly ringing = new ObservableIndexedObjectCollection<IncomingCall>(
        incoming => incoming.call.location.roomId,
    );

    public constructor(private tracker: ChatStateTracker) {
        this.tracker.client.on('Session', ev => this.handleSession(ev));
        this.tracker.client.on('CallUpdated', ev => this.handleCallUpdated(ev));
        this.tracker.client.on(
            'CallMemberJoined',
            ev => this.handleMemberChanged(ev.roomId, ev.member.user.id, ev.member),
        );
        this.tracker.client.on('CallMemberUpdated', ev => this.handleMemberChanged(ev.roomId, ev.userId, ev.member));
        this.tracker.client.on('CallMemberLeft', ev => this.handleMemberChanged(ev.roomId, ev.userId));
        this.tracker.client.on('IncomingCallUpdated', ev => this.handleIncomingCallUpdated(ev));
        this.tracker.client.on('RoomLeft', ev => this.handleRoomGone(ev));
        this.tracker.client.on('RoomDeleted', ev => this.handleRoomGone(ev));
        this.tracker.client.on('SpaceLeft', ev => this.handleSpaceGone(ev));
        this.tracker.client.on('SpaceDeleted', ev => this.handleSpaceGone(ev));
    }

    /**
     * Ongoing calls in the rooms you are a member of, keyed by room id - at most one per room. Filled with the
     * session and kept current by the server; a call leaves the collection when its last member leaves.
     * Not part of the state snapshot, so it stays empty until the first session.
     */
    public async get(): Promise<ObservableIndexedObjectCollection<Call>> {
        await this.tracker.getMe();
        return this.list;
    }

    /**
     * Calls ringing at you, keyed by room id. A call leaves the collection when it is answered or declined on any of
     * your devices, or when it ends. Filled with the session, like the ongoing calls.
     */
    public async getRinging(): Promise<ObservableIndexedObjectCollection<IncomingCall>> {
        await this.tracker.getMe();
        return this.ringing;
    }

    /**
     * Members of the call with a raised hand, in the order they raised it - the queue in the `Queue` mode.
     */
    public getQueue(call: Call): CallMember[] {
        return call.members
            .filter(member => member.handRaisedAt)
            // Whole seconds; the server breaks ties by comparing user ids as plain strings.
            .sort((a, b) => Date.parse(a.handRaisedAt) - Date.parse(b.handRaisedAt)
                || (a.user.id < b.user.id ? -1 : Number(a.user.id > b.user.id)));
    }

    /**
     * A page of the members of the call the call message stands for, in the order they joined. The message itself
     * carries only some of them (`MessageCall.partialMembers`) and their count.
     */
    public async getMembers(messageId: string, page: {limit?: number, offset?: number} = {}): Promise<CallMember[]> {
        return (await this.send('GetCallMembers', {messageId, ...page})).members;
    }

    /**
     * Join the call in the room, starting it if there is none. Connect to the media server with the returned access
     * yourself; leaving the call is disconnecting from it. Joining another call makes the server end your
     * participation in the previous one. In the `Stage` and `Queue` modes you join as a listener (a moderator as a
     * speaker), and the title given when starting the call names its topic.
     */
    public join(roomId: string, title?: string): Promise<CallJoined> {
        return this.send('JoinCall', {roomId, title});
    }

    /**
     * Stop the call ringing at you, on all of your devices. In a one-to-one private room it also ends the call.
     */
    public async decline(roomId: string): Promise<void> {
        await this.send('DeclineCall', {roomId});
    }

    /**
     * Invite the given members of the room, or the room members having one of the roles, to the call - it rings at
     * them. Members already in the call and you are skipped.
     */
    public async invite(roomId: string, target: {userIds?: string[], roleIds?: string[]}): Promise<void> {
        await this.send('InviteToCall', {roomId, ...target});
    }

    /**
     * Turn off the microphone of a call member. Only they can turn it on again.
     */
    public async muteMember(roomId: string, userId: string): Promise<void> {
        await this.send('MuteCallMember', {roomId, userId});
    }

    public async kickMember(roomId: string, userId: string): Promise<void> {
        await this.send('KickCallMember', {roomId, userId});
    }

    /**
     * Raise or lower your hand (in the `Queue` mode: enter or leave the queue) and leave the stage, which in the
     * `Queue` mode ends your turn. A moderator also moves a member to the stage and off it (skipping their turn),
     * lowers their hand and blocks them from raising it until the call ends.
     */
    public async updateMember(
        roomId: string,
        userId: string,
        change: {speaker?: boolean, handRaised?: boolean, raiseBlocked?: boolean},
    ): Promise<void> {
        await this.send('UpdateCallMember', {roomId, userId, ...change});
    }

    private async send<CommandType extends keyof CommandsMap>(
        type: CommandType,
        data: CommandRequest<CommandType>,
    ): Promise<CommandResponse<CommandType>> {
        const result = await this.tracker.client.send(type, data);

        if (result.error) {
            throw result.error;
        }

        return result.data;
    }

    private handleSession(ev: Session): void {
        this.list.reconcile(...ev.state.calls);
        this.ringing.reconcile(...ev.state.incomingCalls);
    }

    private handleCallUpdated(ev: CallUpdated): void {
        if (ev.call) {
            // An update sent before the server learned you left the room
            if (this.tracker.rooms._getRoom(ev.roomId)) {
                this.setCall(ev.call);
            }
        } else {
            this.list.delete(ev.roomId);
            this.ringing.delete(ev.roomId);
        }
    }

    private handleIncomingCallUpdated(ev: IncomingCallUpdated): void {
        if (ev.incomingCall) {
            this.ringing.set(ev.incomingCall);
        } else {
            this.ringing.delete(ev.roomId);
        }
    }

    private handleMemberChanged(roomId: string, userId: string, member?: CallMember): void {
        const call = this.list.get(roomId);

        if (! call) {
            return;
        }

        const members = call.members.filter(item => item.user.id !== userId);

        if (member) {
            const index = call.members.findIndex(item => item.user.id === userId);
            members.splice(index === -1 ? members.length : index, 0, member);
        }

        this.setCall({...call, members});
    }

    private setCall(call: Call): void {
        this.list.set(call);

        const incoming = this.ringing.get(call.location.roomId);

        if (incoming) {
            this.ringing.set({...incoming, call});
        }
    }

    private handleRoomGone(ev: RoomLeft | RoomDeleted): void {
        this.list.delete(ev.id);
        this.ringing.delete(ev.id);
    }

    private handleSpaceGone(ev: SpaceLeft | SpaceDeleted): void {
        const roomIdsOf = (calls: Call[]) => calls
            .filter(call => call.location.spaceId === ev.id)
            .map(call => call.location.roomId);

        this.list.delete(...roomIdsOf(this.list.items));
        this.ringing.delete(...roomIdsOf(this.ringing.items.map(incoming => incoming.call)));
    }
}
