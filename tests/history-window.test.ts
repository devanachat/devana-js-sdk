import {TraversableRemoteCollection, WindowState} from "../src/state-tracker/TopicHistoryWindow";

interface SimpleMessage {
    id: number;
}

const messages: SimpleMessage[] = [
    {id: 0},
    {id: 1},
    {id: 2},
    {id: 3},
    {id: 4},
    {id: 5},
    {id: 6},
    {id: 7},
    {id: 8},
    {id: 9},
];

class TestableHistoryWindow extends TraversableRemoteCollection<SimpleMessage> {
    declare protected internalState: TraversableRemoteCollection<SimpleMessage>['internalState'] & {
        traverseLock: boolean,
    };

    public createMirror(): TraversableRemoteCollection<SimpleMessage> {
        throw new Error('Method not implemented.');
    }

    public constructor() {
        super('id');
        this.internalState.traverseLock = false;
    }

    public async setTraverseLock(lock: boolean): Promise<void> {
        this.internalState.traverseLock = lock;

        if (lock && (this.state !== WindowState.LIVE && this.state !== WindowState.LATEST)) {
            await super.resetToLatest();
        }
    }

    public async jumpTo(id: string): Promise<void> {
        if (this.internalState.traverseLock) {
            return;
        }
        return super.jumpTo(id);
    }

    public simulateNewMessageReceived(): void {
        if ([WindowState.LATEST, WindowState.LIVE].includes(this.state)) {
            const lastId = this.getAt(this.length - 1)?.id;

            const messageToAdd = lastId
                ? this.getAt(lastId + 1)
                : messages[messages.length - 1];

            if (messageToAdd) {
                this.addItems([messageToAdd], 'tail');
            }
        }
    }

    protected async fetchItemsAfter(): Promise<SimpleMessage[]> {
        const after = this.getAt(this.length - 1)?.id;
        if (after === undefined) {
            return null;
        }
        // Return only 3 items
        return messages.slice(after + 1, after + 4);
    }

    protected async fetchItemsAround(id: string): Promise<SimpleMessage[] | null> {
        const numericId = parseInt(id, 10);
        const item = messages.find(m => m.id === numericId);
        if (!item) {
            return null;
        }
        const index = messages.indexOf(item);
        const start = Math.max(0, index - Math.floor(this.fetchLimit / 2));
        const end = Math.min(messages.length, index + Math.ceil(this.fetchLimit / 2));
        return messages.slice(start, end);
    }

    protected async fetchItemsBefore(): Promise<SimpleMessage[]> {
        const before = this.getAt(0)?.id;
        if (before === undefined) {
            return null;
        }
        return messages.slice(Math.max(before - 3, 0), before);
    }

    protected async fetchLatestItems(): Promise<SimpleMessage[]> {
        return messages.slice(-3);
    }

    protected async isLatestItemLoaded(): Promise<boolean> {
        return this.has(messages.length - 1);
    }
}

test('history window - fresh instance', async () => {
    const window = new TestableHistoryWindow();
    expect(window.items).toHaveLength(0);
    expect(window.limit).toEqual(1000);
    expect(window.retainRatio).toEqual(1);
});

test('history window - states change', async () => {
    const window = new TestableHistoryWindow();
    window.limit = 5;
    window.fetchLimit = 3;

    expect(window.state).toEqual(WindowState.LIVE);

    window.simulateNewMessageReceived(); // [9]

    expect(window.state).toEqual(WindowState.LIVE);

    await window.fetchPrevious(); // [6,7,8,9]
    await window.fetchPrevious(); // [3,4,5,6,7]

    expect(window.state).toEqual(WindowState.PAST);

    await window.fetchPrevious(); // [0,1,2,3,4]
    await window.fetchPrevious(); // [0,1,2,3,4]

    expect(window.state).toEqual(WindowState.OLDEST);

    await window.resetToLatest(); // [7,8,9]

    expect(window.state).toEqual(WindowState.LATEST);
});

test('history window - traverse back', async () => {
    const window = new TestableHistoryWindow();
    window.limit = 5;
    window.fetchLimit = 3;

    await window.fetchPrevious(); // 7,8,9

    expect(window.state).toEqual(WindowState.LATEST);
    expect(window.items).toHaveLength(3);
    [7,8,9].forEach(id => expect(window.items.map(item => item.id)).toContain(id));

    await window.fetchPrevious(); // 4,5,6,7,8

    expect(window.state).toEqual(WindowState.PAST);
    expect(window.items).toHaveLength(5);
    [4,5,6,7,8].forEach(id => expect(window.items.map(item => item.id)).toContain(id));

    await window.fetchPrevious(); // 1,2,3,4,5
    await window.fetchPrevious(); // 0,1,2,3,4
    await window.fetchPrevious(); // 0,1,2,3,4

    expect(window.state).toEqual(WindowState.OLDEST);
    expect(window.items).toHaveLength(5);
    [0,1,2,3,4].forEach(id => expect(window.items.map(item => item.id)).toContain(id));
});

test('history window - traverse forward', async () => {
    const window = new TestableHistoryWindow();
    window.limit = 5;
    window.fetchLimit = 3;

    await window.fetchNext(); // []

    expect(window.state).toEqual(WindowState.LIVE);
    expect(window.items).toHaveLength(0);

    await window.resetToLatest(); // [7,8,9]

    expect(window.state).toEqual(WindowState.LATEST);
    expect(window.items).toHaveLength(3);

    [7,8,9].forEach(id => expect(window.items.map(item => item.id)).toContain(id));

    await window.fetchPrevious(); // [4,5,6,7,8]
    await window.fetchPrevious(); // [1,2,3,4,5]
    await window.fetchNext(); // [4,5,6,7,8]

    expect(window.state).toEqual(WindowState.PAST);
    expect(window.items).toHaveLength(5);
    [4,5,6,7,8].forEach(id => expect(window.items.map(item => item.id)).toContain(id));

    await window.fetchNext();
    await window.fetchNext();
    await window.fetchNext(); // move to latest

    expect(window.state).toEqual(WindowState.LATEST);
    expect(window.items).toHaveLength(5);
    [5,6,7,8,9].forEach(id => expect(window.items.map(item => item.id)).toContain(id));
});

test('history window - reset to latest', async () => {
    const window = new TestableHistoryWindow();
    window.limit = 5;
    window.fetchLimit = 3;

    await window.fetchPrevious(); // [7,8,9]
    await window.fetchPrevious(); // [4,5,6,7,8]
    await window.fetchPrevious(); // [1,2,3,4,5]

    expect(window.state).toEqual(WindowState.PAST);

    await window.resetToLatest();

    expect(window.state).toEqual(WindowState.LATEST);
    expect(window.items).toHaveLength(3);
    [7,8,9].forEach(id => expect(window.items.map(item => item.id)).toContain(id));
});

test('history window - resync to latest merges the new page into loaded items', async () => {
    const window = new TestableHistoryWindow();
    window.limit = 10;
    window.fetchLimit = 3;

    await window.resetToLatest(); // [7,8,9]
    await window.fetchPrevious(); // [4,5,6,7,8,9]

    await window.resyncToLatest(); // fetched [7,8,9] overlaps -> nothing is lost

    expect(window.state).toEqual(WindowState.LATEST);
    expect(window.items.map(item => item.id)).toEqual([4, 5, 6, 7, 8, 9]);
});

test('history window - resync to latest trims the merged items to the limit', async () => {
    const window = new TestableHistoryWindow();
    window.limit = 4;
    window.fetchLimit = 3;

    await window.resetToLatest(); // [7,8,9]
    await window.fetchPrevious(); // [4,5,6,7] (trimmed to the limit)

    // [4,5,6,7] merged with the page [7,8,9] -> [4,5,6,7,8,9], trimmed again.
    await window.resyncToLatest();

    expect(window.state).toEqual(WindowState.LATEST);
    expect(window.items.map(item => item.id)).toEqual([6, 7, 8, 9]);
});

test('history window - resync to latest marks the gap instead of dropping items', async () => {
    const window = new TestableHistoryWindow();
    window.limit = 10;
    window.fetchLimit = 3;

    await window.jumpTo('1'); // [0,1,2]

    expect(window.gaps).toEqual([]);

    // A full page ([7,8,9]) that does not reach the newest loaded item (2):
    // items 3..6 were never fetched, so the seam in front of 7 is marked.
    await window.resyncToLatest();

    expect(window.state).toEqual(WindowState.LATEST);
    expect(window.items.map(item => item.id)).toEqual([0, 1, 2, 7, 8, 9]);
    expect(window.gaps).toEqual([7]);
});

test('history window - gap marker disappears with the item it points at', async () => {
    const window = new TestableHistoryWindow();
    window.limit = 10;
    window.fetchLimit = 3;

    await window.jumpTo('1'); // [0,1,2]
    await window.resyncToLatest(); // [0,1,2] | [7,8,9]

    expect(window.gaps).toEqual([7]);

    window.delete(7);

    expect(window.gaps).toEqual([]);
});

test('history window - gap marker is closed by fetching what is before it', async () => {
    const window = new TestableHistoryWindow();
    window.limit = 10;
    window.fetchLimit = 3;

    await window.jumpTo('1'); // [0,1,2]
    await window.resyncToLatest(); // [0,1,2] | [7,8,9]
    window.delete(0, 1, 2); // the items above the gap are gone, 7 is the top one

    expect(window.gaps).toEqual([7]);

    // Whatever comes back was fetched as the direct predecessor of 7, so the
    // history is continuous again.
    await window.fetchPrevious(); // [4,5,6,7,8,9]

    expect(window.items.map(item => item.id)).toEqual([4, 5, 6, 7, 8, 9]);
    expect(window.gaps).toEqual([]);
});

test('history window - gap markers are cleared when the whole window is replaced', async () => {
    const window = new TestableHistoryWindow();
    window.limit = 10;
    window.fetchLimit = 3;

    await window.jumpTo('1'); // [0,1,2]
    await window.resyncToLatest(); // [0,1,2] | [7,8,9]

    expect(window.gaps).toEqual([7]);

    await window.resetToLatest(true); // [7,8,9] - a continuous window again

    expect(window.items.map(item => item.id)).toEqual([7, 8, 9]);
    expect(window.gaps).toEqual([]);
});

test('history window - gap marker is forgotten when trimmed out of the window', async () => {
    const window = new TestableHistoryWindow();
    window.limit = 10;
    window.fetchLimit = 3;

    await window.jumpTo('1'); // [0,1,2]
    await window.resyncToLatest(); // [0,1,2] | [7,8,9]

    expect(window.gaps).toEqual([7]);

    // The window shrinks and the trimming pushes item 7 (and everything above
    // it) out, so the marker has nothing left to point at.
    window.limit = 2;
    await window.resyncToLatest();

    expect(window.items.map(item => item.id)).toEqual([8, 9]);
    expect(window.gaps).toEqual([]);
});

test('history window - resync to latest keeps loaded items when the page is not full', async () => {
    const window = new TestableHistoryWindow();
    window.limit = 10;
    window.fetchLimit = 5; // The fetch returns 3 items only - all there is.

    await window.jumpTo('1'); // [0,1,2,3]

    // Nothing is missing in between: the page is everything the remote side has,
    // so the loaded items are kept even though the page does not reach them.
    await window.resyncToLatest();

    expect(window.state).toEqual(WindowState.LATEST);
    expect(window.items.map(item => item.id)).toEqual([0, 1, 2, 3, 7, 8, 9]);
});

test('history window - jump asked for during another fetch lands after it', async () => {
    const window = new TestableHistoryWindow();
    window.limit = 10;
    window.fetchLimit = 3;

    const reset = window.resetToLatest();
    await window.jumpTo('1');
    await reset;

    expect(window.items.map(item => item.id)).toEqual([0, 1, 2]);
});

test('history window - jump repeated while the first one runs finds the item loaded', async () => {
    const window = new TestableHistoryWindow();
    window.limit = 10;
    window.fetchLimit = 3;

    const first = window.jumpTo('1');
    await window.jumpTo('1');

    expect(window.has(1)).toBe(true);
    await first;
    expect(window.items.map(item => item.id)).toEqual([0, 1, 2]);
});

test('history window - jump to message', async () => {
    const window = new TestableHistoryWindow();
    window.limit = 5;
    window.fetchLimit = 3;

    await window.resetToLatest(); // [7,8,9]
    await window.jumpTo('2'); // [1,2,3]

    expect(window.state).toEqual(WindowState.PAST);
    expect(window.items).toHaveLength(3);
    [1,2,3].forEach(id => expect(window.items.map(item => item.id)).toContain(id));
});

test('history window - jump to message already in window', async () => {
    const window = new TestableHistoryWindow();
    window.limit = 5;
    window.fetchLimit = 3;

    await window.resetToLatest(); // [7,8,9]
    const itemsBeforeJump = window.items;
    await window.jumpTo('8');

    expect(window.items).toEqual(itemsBeforeJump);
});

test('history window - jump to non-existent message', async () => {
    const window = new TestableHistoryWindow();
    window.limit = 5;
    window.fetchLimit = 3;

    await window.resetToLatest(); // [7,8,9]
    const itemsBeforeJump = window.items;
    await window.jumpTo('99'); // non-existent

    expect(window.items).toEqual(itemsBeforeJump);
});

test('history window - jump to message with traverseLock', async () => {
    const window = new TestableHistoryWindow();
    window.limit = 5;
    window.fetchLimit = 3;

    await window.resetToLatest(); // [7,8,9]
    await window.setTraverseLock(true);
    await window.jumpTo('2');

    expect(window.state).toEqual(WindowState.LATEST);
    expect(window.items).toHaveLength(3);
    [7,8,9].forEach(id => expect(window.items.map(item => item.id)).toContain(id));
});

test('history window - trim messages window to limit', async () => {
    const window = new TestableHistoryWindow();
    window.limit = 5;
    window.fetchLimit = 3;

    expect(window.items).toHaveLength(0);

    await window.fetchPrevious(); // [7,8,9]

    expect(window.items).toHaveLength(3);

    await window.fetchPrevious(); // [4,5,6,7,8]

    expect(window.items).toHaveLength(5);

    await window.fetchNext(); // [5,6,7,8,9]

    expect(window.items).toHaveLength(5);

    await window.fetchPrevious(); // [2,3,4,5,6]

    expect(window.items).toHaveLength(5);

    window.simulateNewMessageReceived();
    window.simulateNewMessageReceived();

    expect(window.items).toHaveLength(5);
});

test('history window - states priority', async () => {
    const window = new TestableHistoryWindow();
    window.limit = 10;

    await window.resetToLatest(); // [7,8,9]

    expect(window.state).toEqual(WindowState.LATEST);

    await window.fetchPrevious(); // [4,5,6,7,8,9]
    await window.fetchPrevious(); // [1,2,3,4,5,6,7,8,9]
    await window.fetchPrevious(); // [0,1,2,3,4,5,6,7,8,9]

    expect(window.state).toEqual(WindowState.LATEST);
    expect(window.hasOldest).toBeTruthy();
    expect(window.hasLatest).toBeTruthy();

    await window.fetchPrevious();

    expect(window.hasOldest).toBeTruthy();
});

test('history window - hasOldest when in LATEST and length < fetchLimit', async () => {
    const window = new TestableHistoryWindow();
    // ensure fetchLimit is larger than the loaded items count (loaded: 3)
    window.fetchLimit = 10;

    await window.resetToLatest(); // loads 3 items

    expect(window.state).toEqual(WindowState.LATEST);
    expect(window.items).toHaveLength(3);
    expect(window.fetchLimit).toEqual(10);
    expect(window.hasOldest).toBeTruthy();
});

test('history window - hasOldest false when in LATEST and length == fetchLimit', async () => {
    const window = new TestableHistoryWindow();
    // set fetchLimit equal to loaded items count
    window.fetchLimit = 3;

    await window.resetToLatest(); // loads 3 items

    expect(window.state).toEqual(WindowState.LATEST);
    expect(window.items).toHaveLength(3);
    expect(window.fetchLimit).toEqual(3);
    expect(window.hasOldest).toBeFalsy();
});

test('history window - high/low watermark limit (retainRatio)', async () => {
    const window = new TestableHistoryWindow();
    window.limit = 6; // High Watermark
    window.retainRatio = 0.5; // Low Watermark target = 6 * 0.5 = 3
    window.fetchLimit = 3;

    await window.resetToLatest(); // [7, 8, 9]

    expect(window.items).toHaveLength(3);

    await window.fetchPrevious(); // [4, 5, 6] added to 'head' -> [4, 5, 6, 7, 8, 9]

    expect(window.items).toHaveLength(6);
    [4, 5, 6, 7, 8, 9].forEach(id => expect(window.items.map(item => item.id)).toContain(id));

    await window.fetchPrevious(); // [1, 2, 3] added to 'head' -> [1, 2, 3, 4, 5, 6, 7, 8, 9]

    expect(window.items).toHaveLength(3);
    [1, 2, 3].forEach(id => expect(window.items.map(item => item.id)).toContain(id));
    expect(window.state).toEqual(WindowState.PAST);

    await window.fetchNext(); // [4, 5, 6] added to 'tail' -> [1, 2, 3, 4, 5, 6]

    expect(window.items).toHaveLength(6);
    [1, 2, 3, 4, 5, 6].forEach(id => expect(window.items.map(item => item.id)).toContain(id));

    await window.fetchNext(); // [7, 8, 9] added to 'tail' -> [1, 2, 3, 4, 5, 6, 7, 8, 9]

    expect(window.items).toHaveLength(3);
    [7, 8, 9].forEach(id => expect(window.items.map(item => item.id)).toContain(id));
    expect(window.state).toEqual(WindowState.LATEST);
});
