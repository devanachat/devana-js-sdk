import {EventTarget} from "../src/EventTarget";
import {ChatStateTracker} from "../src/state-tracker/ChatStateTracker";

class FakeClient extends EventTarget {
    public async send(type: string, data: any): Promise<{ data: any; error: any }> {
        if (type !== 'GetEmoticons') {
            return {data: undefined, error: null};
        }
        const response = data.ids
            ? {location: null, emoticons: [emoticon('picked', 'S2')]}
            : {location: {spaceId: data.spaceId}, emoticons: [emoticon(`e-${data.spaceId ?? 'global'}`, data.spaceId)]};
        this.emit('Emoticons', response);
        return {data: response, error: null};
    }
}

const emoticon = (id: string, spaceId?: string): any => ({
    id, spaceId, name: id, fileId: 'f', user: {id: 'u1', nick: 'u1', avatar: '', tags: []},
});

describe('EmoticonsManager', () => {
    test('a selection by ids leaves the loaded collections untouched', async () => {
        const client = new FakeClient();
        const tracker = new ChatStateTracker(client as any);

        const global = await tracker.emoticons.get();
        const space = await tracker.emoticons.get('S1');

        await client.send('GetEmoticons', {ids: ['picked']});

        expect(global.items.map(item => item.id)).toEqual(['e-global']);
        expect(space.items.map(item => item.id)).toEqual(['e-S1']);
        expect(tracker.emoticons._exportEmoticons().map(item => item.spaceId).sort()).toEqual(['S1', null].sort());
    });
});
