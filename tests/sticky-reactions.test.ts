import {EventTarget} from "../src/EventTarget";
import {RoomsManager} from "../src/state-tracker/RoomsManager";
import {SpacesManager} from "../src/state-tracker/SpacesManager";

const ROOM = 'R';
const TOPIC = 'topic-R';
const LOCATION = {roomId: ROOM, topicId: TOPIC};
const THUMBS = {type: 'Emoji', value: '👍'};

class FakeClient extends EventTarget {
    public readonly sent: [string, any][] = [];
    public own: any[] = [THUMBS];

    public async send(name: string, data: any): Promise<{ data: any; error: any }> {
        this.sent.push([name, data]);

        if (name === 'GetMessages') {
            return {data: {location: LOCATION, messages: [], myReactions: [{messageId: 'poll', reactions: this.own}]}, error: null};
        }

        return {data: undefined, error: null};
    }
}

const poll = (reactions: any[] = [{...THUMBS, count: 1}]): any => ({
    id: 'poll',
    type: 'Poll',
    content: '',
    location: LOCATION,
    author: {user: {id: 'other'}},
    reactions,
});

const session = (client: FakeClient) => client.emit('Session', {
    serverVersion: '1.0.0',
    protoVersion: '1.0.0',
    user: {id: 'me'},
    state: {
        rooms: [{
            id: ROOM, spaceId: null, name: ROOM, description: '', type: 'Text',
            defaultTopic: {id: TOPIC, messageCount: 1, lastMessage: null, stickyMessage: poll()},
            participants: null, recipients: null, flags: 0, stream: null, history: {mode: 'Ephemeral'},
        }],
        spaces: [],
    },
} as any);

const setup = () => {
    const client = new FakeClient();
    const tracker: any = {client, getMe: async () => ({id: 'me'})};
    tracker.rooms = new RoomsManager(tracker);
    tracker.spaces = new SpacesManager(tracker);
    session(client);

    return {client, rooms: tracker.rooms as RoomsManager};
};

describe('Reactions of a sticky message', () => {
    test('the own ones are fetched once, without the history around the message', async () => {
        const {client, rooms} = setup();

        await rooms.getStickyMyReactions(LOCATION, 'poll');
        const own = await rooms.getStickyMyReactions(LOCATION, 'poll');

        expect(own.get('poll').reactions).toEqual([THUMBS]);
        expect(client.sent.filter(([name]) => name === 'GetMessages')).toEqual([
            ['GetMessages', {location: LOCATION, around: 'poll', limit: 1, includeMyReactions: true}],
        ]);
    });

    test('the own ones follow the votes of the user', async () => {
        const {client, rooms} = setup();
        const own = await rooms.getStickyMyReactions(LOCATION, 'poll');

        client.emit('Reacted', {messageId: 'poll', reaction: {...THUMBS, isAdded: false}} as any);
        client.emit('Reacted', {messageId: 'poll', reaction: {type: 'Emoji', value: '👎', isAdded: true}} as any);

        expect(own.get('poll').reactions).toEqual([{type: 'Emoji', value: '👎'}]);
    });

    test('the counters of the sticky message follow the room', async () => {
        const {client, rooms} = setup();
        const topics = await rooms.getTopics(ROOM);

        client.emit('ReactionUpdated', {messageId: 'poll', reaction: {...THUMBS, count: 2}} as any);
        expect(topics.get(TOPIC).stickyMessage.reactions).toEqual([{...THUMBS, count: 2}]);

        client.emit('ReactionUpdated', {messageId: 'poll', reaction: {...THUMBS, count: 0}} as any);
        expect(topics.get(TOPIC).stickyMessage.reactions).toEqual([]);
    });

    test('a reconnect fetches the own ones anew', async () => {
        const {client, rooms} = setup();
        await rooms.getStickyMyReactions(LOCATION, 'poll');

        client.own = [];
        session(client);
        const own = await rooms.getStickyMyReactions(LOCATION, 'poll');

        expect(own.get('poll').reactions).toEqual([]);
        expect(client.sent.filter(([name]) => name === 'GetMessages')).toHaveLength(2);
    });
});
