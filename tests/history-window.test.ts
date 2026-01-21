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
    public createMirror(): TraversableRemoteCollection<SimpleMessage> {
        throw new Error('Method not implemented.');
    }

    public constructor() {
        super('id');
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
    expect(window.limit).toEqual(50);
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
