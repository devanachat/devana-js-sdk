import {
    IndexedCollection,
    IndexedObjectCollection,
    ObservableIndexedCollection,
    ObservableIndexedObjectCollection,
    CollectionEventMap,
} from '../src/IndexedObjectCollection';

// ============================================================================
// IndexedCollection Tests
// ============================================================================

describe('IndexedCollection', () => {
    test('constructor - creates empty collection', () => {
        const collection = new IndexedCollection<string, number>();
        expect(collection.length).toBe(0);
    });

    test('constructor - creates collection with initial items', () => {
        const collection = new IndexedCollection<string, number>([
            ['a', 1],
            ['b', 2],
        ]);

        expect(collection.length).toBe(2);
        expect(collection.get('a')).toBe(1);
        expect(collection.get('b')).toBe(2);
    });

    test('set - adds single item', () => {
        const collection = new IndexedCollection<string, number>();

        collection.set(['a', 1]);

        expect(collection.get('a')).toBe(1);
    });

    test('set - adds multiple items', () => {
        const collection = new IndexedCollection<string, number>();

        collection.set(['a', 1], ['b', 2], ['c', 3]);

        expect(collection.length).toBe(3);
    });

    test('set - overwrites existing item with same key', () => {
        const collection = new IndexedCollection<string, number>();

        collection.set(['a', 1]);
        collection.set(['a', 100]);

        expect(collection.get('a')).toBe(100);
        expect(collection.length).toBe(1);
    });

    test('get - returns item by key', () => {
        const collection = new IndexedCollection<string, number>([['a', 1]]);

        expect(collection.get('a')).toBe(1);
    });

    test('get - returns undefined for non-existent key', () => {
        const collection = new IndexedCollection<string, number>();

        expect(collection.get('nonexistent')).toBeUndefined();
    });

    test('has - returns true for existing key', () => {
        const collection = new IndexedCollection<string, number>([['a', 1]]);

        expect(collection.has('a')).toBe(true);
    });

    test('has - returns false for non-existent key', () => {
        const collection = new IndexedCollection<string, number>();

        expect(collection.has('a')).toBe(false);
    });

    test('delete - removes single item', () => {
        const collection = new IndexedCollection<string, number>([
            ['a', 1],
            ['b', 2],
        ]);

        collection.delete('a');

        expect(collection.has('a')).toBe(false);
        expect(collection.length).toBe(1);
    });

    test('delete - removes multiple items', () => {
        const collection = new IndexedCollection<string, number>([
            ['a', 1],
            ['b', 2],
            ['c', 3],
        ]);

        collection.delete('a', 'c');

        expect(collection.length).toBe(1);
        expect(collection.has('b')).toBe(true);
    });

    test('delete - does not throw when deleting non-existent key', () => {
        const collection = new IndexedCollection<string, number>();

        expect(() => collection.delete('nonexistent')).not.toThrow();
    });

    test('deleteAll - removes all items', () => {
        const collection = new IndexedCollection<string, number>([
            ['a', 1],
            ['b', 2],
        ]);

        collection.deleteAll();

        expect(collection.length).toBe(0);
    });

    test('deleteAll - works on empty collection', () => {
        const collection = new IndexedCollection<string, number>();

        expect(() => collection.deleteAll()).not.toThrow();
        expect(collection.length).toBe(0);
    });

    test('items - returns internal Map', () => {
        const collection = new IndexedCollection<string, number>([['a', 1]]);

        expect(collection.items).toBeInstanceOf(Map);
        expect(collection.items.get('a')).toBe(1);
    });

    test('length - returns correct count after operations', () => {
        const collection = new IndexedCollection<string, number>();

        expect(collection.length).toBe(0);

        collection.set(['a', 1]);
        expect(collection.length).toBe(1);

        collection.set(['b', 2], ['c', 3]);
        expect(collection.length).toBe(3);
    });

    test('createMirror - shares same internal data', () => {
        const collection = new IndexedCollection<string, number>([['a', 1]]);
        const mirror = collection.createMirror();

        expect(mirror.get('a')).toBe(1);

        collection.set(['b', 2]);
        expect(mirror.get('b')).toBe(2);

        mirror.set(['c', 3]);
        expect(collection.get('c')).toBe(3);
    });
});

// ============================================================================
// IndexedObjectCollection Tests
// ============================================================================

interface TestItem {
    id: string;
    name: string;
    value: number;
}

describe('IndexedObjectCollection', () => {
    const createItem = (id: string, name: string, value: number): TestItem => ({
        id,
        name,
        value,
    });

    test('constructor - creates empty collection with key property', () => {
        const collection = new IndexedObjectCollection<TestItem>('id');

        expect(collection.length).toBe(0);
    });

    test('constructor - creates collection with initial items', () => {
        const collection = new IndexedObjectCollection<TestItem>('id', [
            createItem('1', 'first', 100),
            createItem('2', 'second', 200),
        ]);

        expect(collection.length).toBe(2);
    });

    test('constructor - supports function as id extractor', () => {
        const collection = new IndexedObjectCollection<TestItem>(
            item => `prefix_${item.id}`,
            [createItem('1', 'first', 100)]
        );

        expect(collection.get('prefix_1')).toBeDefined();
    });

    test('set - adds item using id property', () => {
        const collection = new IndexedObjectCollection<TestItem>('id');
        const item = createItem('1', 'test', 100);

        collection.set(item);

        expect(collection.get('1')).toEqual(item);
    });

    test('set - adds multiple items', () => {
        const collection = new IndexedObjectCollection<TestItem>('id');

        collection.set(
            createItem('1', 'first', 100),
            createItem('2', 'second', 200)
        );

        expect(collection.length).toBe(2);
    });

    test('set - overwrites existing item with same id', () => {
        const collection = new IndexedObjectCollection<TestItem>('id');

        collection.set(createItem('1', 'original', 100));
        collection.set(createItem('1', 'updated', 200));

        expect(collection.get('1')?.name).toBe('updated');
        expect(collection.length).toBe(1);
    });

    test('get - returns item by id', () => {
        const item = createItem('1', 'test', 100);
        const collection = new IndexedObjectCollection<TestItem>('id', [item]);

        expect(collection.get('1')).toEqual(item);
    });

    test('get - returns undefined for non-existent id', () => {
        const collection = new IndexedObjectCollection<TestItem>('id');

        expect(collection.get('nonexistent')).toBeUndefined();
    });

    test('getAt - returns item at index', () => {
        const items = [
            createItem('1', 'first', 100),
            createItem('2', 'second', 200),
        ];
        const collection = new IndexedObjectCollection<TestItem>('id', items);

        expect(collection.getAt(0)).toEqual(items[0]);
        expect(collection.getAt(1)).toEqual(items[1]);
    });

    test('getAt - returns undefined for out of bounds index', () => {
        const collection = new IndexedObjectCollection<TestItem>('id');

        expect(collection.getAt(0)).toBeUndefined();
        expect(collection.getAt(100)).toBeUndefined();
    });

    test('has - returns true for existing id', () => {
        const collection = new IndexedObjectCollection<TestItem>('id', [
            createItem('1', 'test', 100),
        ]);

        expect(collection.has('1')).toBe(true);
    });

    test('has - returns false for non-existent id', () => {
        const collection = new IndexedObjectCollection<TestItem>('id');

        expect(collection.has('1')).toBe(false);
    });

    test('delete - removes item by id', () => {
        const collection = new IndexedObjectCollection<TestItem>('id', [
            createItem('1', 'first', 100),
            createItem('2', 'second', 200),
        ]);

        collection.delete('1');

        expect(collection.has('1')).toBe(false);
        expect(collection.length).toBe(1);
    });

    test('delete - removes multiple items', () => {
        const collection = new IndexedObjectCollection<TestItem>('id', [
            createItem('1', 'first', 100),
            createItem('2', 'second', 200),
            createItem('3', 'third', 300),
        ]);

        collection.delete('1', '3');

        expect(collection.length).toBe(1);
        expect(collection.has('2')).toBe(true);
    });

    test('deleteAll - removes all items', () => {
        const collection = new IndexedObjectCollection<TestItem>('id', [
            createItem('1', 'first', 100),
            createItem('2', 'second', 200),
        ]);

        collection.deleteAll();

        expect(collection.length).toBe(0);
    });

    test('items - returns array of values', () => {
        const items = [
            createItem('1', 'first', 100),
            createItem('2', 'second', 200),
        ];
        const collection = new IndexedObjectCollection<TestItem>('id', items);

        expect(collection.items).toEqual(items);
    });

    test('findBy - finds items by field value', () => {
        const collection = new IndexedObjectCollection<TestItem>('id', [
            createItem('1', 'test', 100),
            createItem('2', 'test', 200),
            createItem('3', 'other', 300),
        ]);

        const result = collection.findBy('name', 'test');

        expect(result.length).toBe(2);
    });

    test('findBy - respects limit parameter', () => {
        const collection = new IndexedObjectCollection<TestItem>('id', [
            createItem('1', 'test', 100),
            createItem('2', 'test', 200),
            createItem('3', 'test', 300),
        ]);

        const result = collection.findBy('name', 'test', 2);

        expect(result.length).toBe(2);
    });

    test('findBy - returns empty collection when no matches', () => {
        const collection = new IndexedObjectCollection<TestItem>('id', [
            createItem('1', 'test', 100),
        ]);

        const result = collection.findBy('name', 'nonexistent');

        expect(result.length).toBe(0);
    });

    test('createMirror - shares same internal data', () => {
        const collection = new IndexedObjectCollection<TestItem>('id', [
            createItem('1', 'first', 100),
        ]);
        const mirror = collection.createMirror();

        expect(mirror.get('1')).toEqual(collection.get('1'));

        collection.set(createItem('2', 'second', 200));
        expect(mirror.get('2')).toBeDefined();
    });
});

// ============================================================================
// ObservableIndexedCollection Tests
// ============================================================================

describe('ObservableIndexedCollection', () => {
    test('constructor - creates empty observable collection', () => {
        const collection = new ObservableIndexedCollection<string, number>();

        expect(collection.length).toBe(0);
    });

    test('set - emits change event with set item keys', () => {
        const collection = new ObservableIndexedCollection<string, number>();
        const handler = jest.fn();
        collection.on('change', handler);

        collection.set(['a', 1], ['b', 2]);

        expect(handler).toHaveBeenCalledWith({ setItems: ['a', 'b'] });
    });

    test('set - does not emit event when setting empty array', () => {
        const collection = new ObservableIndexedCollection<string, number>();
        const handler = jest.fn();
        collection.on('change', handler);

        collection.set();

        expect(handler).not.toHaveBeenCalled();
    });

    test('delete - emits change event with deleted item keys', () => {
        const collection = new ObservableIndexedCollection<string, number>([
            ['a', 1],
            ['b', 2],
        ]);
        const handler = jest.fn();
        collection.on('change', handler);

        collection.delete('a', 'b');

        expect(handler).toHaveBeenCalledWith({ deletedItems: ['a', 'b'] });
    });

    test('delete - does not emit event when deleting empty array', () => {
        const collection = new ObservableIndexedCollection<string, number>([['a', 1]]);
        const handler = jest.fn();
        collection.on('change', handler);

        collection.delete();

        expect(handler).not.toHaveBeenCalled();
    });

    test('deleteAll - emits change event with all deleted keys', () => {
        const collection = new ObservableIndexedCollection<string, number>([
            ['a', 1],
            ['b', 2],
        ]);
        const handler = jest.fn();
        collection.on('change', handler);

        collection.deleteAll();

        expect(handler).toHaveBeenCalledWith({
            deletedItems: expect.arrayContaining(['a', 'b']),
        });
    });

    test('deleteAll - does not emit event when collection is empty', () => {
        const collection = new ObservableIndexedCollection<string, number>();
        const handler = jest.fn();
        collection.on('change', handler);

        collection.deleteAll();

        expect(handler).not.toHaveBeenCalled();
    });

    test('on - registers event handler', () => {
        const collection = new ObservableIndexedCollection<string, number>();
        const handler = jest.fn();

        collection.on('change', handler);
        collection.set(['a', 1]);

        expect(handler).toHaveBeenCalledTimes(1);
    });

    test('on - allows multiple handlers for same event', () => {
        const collection = new ObservableIndexedCollection<string, number>();
        const handler1 = jest.fn();
        const handler2 = jest.fn();

        collection.on('change', handler1);
        collection.on('change', handler2);
        collection.set(['a', 1]);

        expect(handler1).toHaveBeenCalledTimes(1);
        expect(handler2).toHaveBeenCalledTimes(1);
    });

    test('on - returns this for chaining', () => {
        const collection = new ObservableIndexedCollection<string, number>();

        const result = collection.on('change', jest.fn());

        expect(result).toBe(collection);
    });

    test('once - triggers handler only once', () => {
        const collection = new ObservableIndexedCollection<string, number>();
        const handler = jest.fn();

        collection.once('change', handler);
        collection.set(['a', 1]);
        collection.set(['b', 2]);

        expect(handler).toHaveBeenCalledTimes(1);
    });

    test('off - unregisters event handler', () => {
        const collection = new ObservableIndexedCollection<string, number>();
        const handler = jest.fn();

        collection.on('change', handler);
        collection.off('change', handler);
        collection.set(['a', 1]);

        expect(handler).not.toHaveBeenCalled();
    });

    test('createMirror - shares eventTarget with mirror', () => {
        const collection = new ObservableIndexedCollection<string, number>();
        const mirror = collection.createMirror();
        const handler = jest.fn();

        mirror.on('change', handler);
        collection.set(['a', 1]);

        expect(handler).toHaveBeenCalled();
    });

    test('createMirror - shares items with mirror', () => {
        const collection = new ObservableIndexedCollection<string, number>([['a', 1]]);
        const mirror = collection.createMirror();

        expect(mirror.get('a')).toBe(1);

        collection.set(['b', 2]);
        expect(mirror.get('b')).toBe(2);
    });

    test('custom event map - supports extended event types', () => {
        type CustomEventMap = CollectionEventMap<string> & {
            customEvent: { data: string };
        };

        const collection = new ObservableIndexedCollection<string, number, CustomEventMap>();
        const changeHandler = jest.fn();
        const customHandler = jest.fn();

        collection.on('change', changeHandler);
        collection.on('customEvent', customHandler);
        collection.set(['a', 1]);

        expect(changeHandler).toHaveBeenCalled();
        expect(customHandler).not.toHaveBeenCalled();
    });
});

// ============================================================================
// ObservableIndexedObjectCollection Tests
// ============================================================================

describe('ObservableIndexedObjectCollection', () => {
    interface TestItem {
        id: string;
        name: string;
    }

    const createItem = (id: string, name: string): TestItem => ({ id, name });

    test('constructor - creates empty observable collection', () => {
        const collection = new ObservableIndexedObjectCollection<TestItem>('id');

        expect(collection.length).toBe(0);
    });

    test('constructor - creates collection with initial items', () => {
        const collection = new ObservableIndexedObjectCollection<TestItem>('id', [
            createItem('1', 'first'),
            createItem('2', 'second'),
        ]);

        expect(collection.length).toBe(2);
    });

    test('on - registers change event handler', () => {
        const collection = new ObservableIndexedObjectCollection<TestItem>('id');
        const handler = jest.fn();

        collection.on('change', handler);
        collection.set(createItem('1', 'test'));

        expect(handler).toHaveBeenCalledWith({ setItems: ['1'] });
    });

    test('on - allows multiple handlers', () => {
        const collection = new ObservableIndexedObjectCollection<TestItem>('id');
        const handler1 = jest.fn();
        const handler2 = jest.fn();

        collection.on('change', handler1);
        collection.on('change', handler2);
        collection.set(createItem('1', 'test'));

        expect(handler1).toHaveBeenCalledTimes(1);
        expect(handler2).toHaveBeenCalledTimes(1);
    });

    test('on - returns this for chaining', () => {
        const collection = new ObservableIndexedObjectCollection<TestItem>('id');

        const result = collection.on('change', jest.fn());

        expect(result).toBe(collection);
    });

    test('once - triggers handler only once', () => {
        const collection = new ObservableIndexedObjectCollection<TestItem>('id');
        const handler = jest.fn();

        collection.once('change', handler);
        collection.set(createItem('1', 'first'));
        collection.set(createItem('2', 'second'));

        expect(handler).toHaveBeenCalledTimes(1);
    });

    test('off - unregisters event handler', () => {
        const collection = new ObservableIndexedObjectCollection<TestItem>('id');
        const handler = jest.fn();

        collection.on('change', handler);
        collection.off('change', handler);
        collection.set(createItem('1', 'test'));

        expect(handler).not.toHaveBeenCalled();
    });

    test('inherited - get returns item by id', () => {
        const item = createItem('1', 'test');
        const collection = new ObservableIndexedObjectCollection<TestItem>('id', [item]);

        expect(collection.get('1')).toEqual(item);
    });

    test('inherited - has returns correct boolean', () => {
        const collection = new ObservableIndexedObjectCollection<TestItem>('id', [
            createItem('1', 'test'),
        ]);

        expect(collection.has('1')).toBe(true);
        expect(collection.has('2')).toBe(false);
    });

    test('inherited - delete removes item', () => {
        const collection = new ObservableIndexedObjectCollection<TestItem>('id', [
            createItem('1', 'test'),
        ]);

        collection.delete('1');

        expect(collection.has('1')).toBe(false);
    });

    test('inherited - deleteAll removes all items', () => {
        const collection = new ObservableIndexedObjectCollection<TestItem>('id', [
            createItem('1', 'first'),
            createItem('2', 'second'),
        ]);

        collection.deleteAll();

        expect(collection.length).toBe(0);
    });

    test('inherited - getAt returns item at index', () => {
        const items = [createItem('1', 'first'), createItem('2', 'second')];
        const collection = new ObservableIndexedObjectCollection<TestItem>('id', items);

        expect(collection.getAt(0)).toEqual(items[0]);
        expect(collection.getAt(1)).toEqual(items[1]);
    });

    test('inherited - findBy finds items by field', () => {
        const collection = new ObservableIndexedObjectCollection<TestItem>('id', [
            createItem('1', 'test'),
            createItem('2', 'test'),
            createItem('3', 'other'),
        ]);

        const result = collection.findBy('name', 'test');

        expect(result.length).toBe(2);
    });

    test('custom events - extended collection emits custom event', () => {
        type TopicHistoryWindowEventMap = CollectionEventMap<string> & {
            reftopicsdeleted: string[];
        };

        class ExtendedCollection extends ObservableIndexedObjectCollection<
            TestItem,
            TopicHistoryWindowEventMap
        > {
            public emitRefTopicsDeleted(ids: string[]): void {
                this.eventTarget.emit('reftopicsdeleted', ids);
            }
        }

        const collection = new ExtendedCollection('id');
        const changeHandler = jest.fn();
        const customHandler = jest.fn();

        collection.on('change', changeHandler);
        collection.on('reftopicsdeleted', customHandler);

        collection.set(createItem('1', 'test'));
        expect(changeHandler).toHaveBeenCalledWith({ setItems: ['1'] });

        collection.emitRefTopicsDeleted(['topic1', 'topic2']);
        expect(customHandler).toHaveBeenCalledWith(['topic1', 'topic2']);
    });

    test('custom events - both change and custom events work together', () => {
        type CustomEventMap = CollectionEventMap<string> & {
            reftopicsdeleted: string[];
        };

        class ExtendedCollection extends ObservableIndexedObjectCollection<
            TestItem,
            CustomEventMap
        > {
            public deleteWithRefTopics(...ids: string[]): void {
                const refTopicIds = this.items
                    .filter(item => ids.includes(item.id))
                    .map(item => `ref_${item.id}`);

                this.delete(...ids);

                if (refTopicIds.length > 0) {
                    this.eventTarget.emit('reftopicsdeleted', refTopicIds);
                }
            }
        }

        const collection = new ExtendedCollection('id', [
            createItem('1', 'first'),
            createItem('2', 'second'),
            createItem('3', 'third'),
        ]);
        const changeHandler = jest.fn();
        const refTopicsHandler = jest.fn();

        collection.on('change', changeHandler);
        collection.on('reftopicsdeleted', refTopicsHandler);

        collection.deleteWithRefTopics('1', '2');

        expect(changeHandler).toHaveBeenCalledWith({ deletedItems: ['1', '2'] });
        expect(refTopicsHandler).toHaveBeenCalledWith(['ref_1', 'ref_2']);
        expect(collection.length).toBe(1);
        ['3'].forEach(id => expect(collection.items.map(item => item.id)).toContain(id));
    });

    test('createMirror - shares eventTarget and items with mirror', () => {
        const collection = new ObservableIndexedObjectCollection<TestItem>('id', [
            createItem('1', 'first'),
        ]);
        const mirror = collection.createMirror();
        const handler = jest.fn();

        mirror.on('change', handler);
        collection.set(createItem('2', 'second'));

        expect(handler).toHaveBeenCalledWith({ setItems: ['2'] });
        expect(mirror.get('2')).toBeDefined();
        expect(mirror.length).toBe(2);
    });
});