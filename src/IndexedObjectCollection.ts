import {ChangeEventMap, EventTarget, ObservableInterface} from "./EventTarget";

export class IndexedCollection<KeyT, ValueT> {
    protected _items: Map<KeyT, ValueT> = new Map();

    public constructor(items: [key: KeyT, value: ValueT][] = []) {
        this.set(...items);
    }

    public get items(): Map<KeyT, ValueT> {
        return this._items;
    }

    public get length(): number {
        return this._items.size;
    }

    public set(...items: [KeyT, ValueT][]): void {
        for (const item of items) {
            this._items.set(item[0], item[1]);
        }
    }

    public get(id: KeyT): ValueT | undefined {
        return this.items.get(id);
    }

    public has(id: KeyT): boolean {
        return this.items.has(id);
    }

    public delete(...ids: KeyT[]): void {
        for (const id of ids) {
            this.items.delete(id);
        }
    }

    public deleteAll(): void {
        this.items.clear();
    }

    public findBy(field: keyof ValueT, valueToFind: any, limit: number = null): IndexedCollection<KeyT, ValueT> {
        const result = new IndexedCollection<KeyT, ValueT>();
        let item;
        while (!(item = this.items.entries().next().value).done) {
            if (limit && result.length === limit) {
                break;
            }
            if (item[1][field] === valueToFind) {
                result.set(item);
            }
        }
        return result;
    }

    public createMirror(): IndexedCollection<KeyT, ValueT> {
        const copy = new IndexedCollection<KeyT, ValueT>();
        copy._items = this._items;
        return copy;
    }
}

export class IndexedObjectCollection<T> {
    protected _items: IndexedCollection<string, T>;

    public constructor(
        public readonly id: keyof T | ((item: T) => any),
        items: T[] = [],
    ) {
        this._items = new IndexedCollection<string, T>();
        this.set(...items);
    }

    public get items(): T[] {
        return Array.from(this._items.items.values());
    }

    public get length(): number {
        return this._items.length;
    }

    public set(...items: T[]): void {
        this._items.set(...(items.map(item => [this.getId(item), item] as [string, T])));
    }

    public get(id: any): T | undefined {
        return this._items.get(id);
    }

    public getAt(index: number): T | undefined {
        return this.items[index];
    }

    public has(id: any): boolean {
        return this._items.has(id);
    }

    public delete(...ids: any[]): void {
        this._items.delete(...ids);
    }

    public deleteAll(): void {
        this._items.deleteAll();
    }

    public findBy(field: keyof T, valueToFind: any, limit: number = null): IndexedObjectCollection<T> {
        const result = new IndexedObjectCollection<T>(this.id);
        for (const value of this.items) {
            if (limit && result.length === limit) {
                break;
            }
            if (value[field] === valueToFind) {
                result.set(value);
            }
        }
        return result;
    }

    public createMirror(): IndexedObjectCollection<T> {
        const copy = new IndexedObjectCollection<T>(this.id);
        copy._items = this._items;
        return copy;
    }

    protected getId(item: T): any {
        return typeof this.id === 'function' ? this.id(item) : item[this.id];
    }
}

type CollectionEventMap<KeyT> = ChangeEventMap<{setItems?: KeyT[], deletedItems?: KeyT[]}>;

export class ObservableIndexedCollection<KeyT, ValueT> extends IndexedCollection<KeyT, ValueT> implements ObservableInterface {
    protected eventTarget: EventTarget<CollectionEventMap<KeyT>>;

    public constructor(items: [key: KeyT, value: ValueT][] = []) {
        super();
        this.eventTarget = new EventTarget<CollectionEventMap<KeyT>>();
        this.set(...items);
    }

    public set(...items: [KeyT, ValueT][]) {
        if (items.length) {
            super.set(...items);
            this.eventTarget.emit('change', {setItems: items.map(item => item[0])});
        }
    }

    public delete(...ids: KeyT[]) {
        if (ids.length) {
            super.delete(...ids);
            this.eventTarget.emit('change', {deletedItems: ids});
        }
    }

    public deleteAll() {
        if (this.length) {
            const ids = this._items.keys();
            super.deleteAll();
            this.eventTarget.emit('change', {deletedItems: Array.from(ids)});
        }
    }

    public createMirror(): ObservableIndexedCollection<KeyT, ValueT> {
        const copy = new ObservableIndexedCollection<KeyT, ValueT>();
        copy.eventTarget = this.eventTarget;
        copy._items = this._items;
        return copy;
    }

    public on(eventName: 'change', handler: (ev?: CollectionEventMap<KeyT>['change']) => void): this {
        this.eventTarget.on(eventName, handler);
        return this;
    }

    public once(eventName: 'change', handler: (ev?: CollectionEventMap<KeyT>['change']) => void): this {
        this.eventTarget.once(eventName, handler);
        return this;
    }

    public off(eventName: string, handler: (ev?: CollectionEventMap<KeyT>['change']) => void): this {
        this.eventTarget.off(eventName, handler);
        return this;
    }
}

export class ObservableIndexedObjectCollection<T> extends IndexedObjectCollection<T> implements ObservableInterface {
    protected eventTarget: EventTarget<CollectionEventMap<string>>;

    public constructor(
        public readonly id: keyof T | ((item: T) => string),
        items: T[] = [],
    ) {
        super(id);
        this.eventTarget = new EventTarget<CollectionEventMap<string>>();
        this.set(...items);
    }

    public set(...items: T[]) {
        if (items.length) {
            super.set(...items);
            this.eventTarget.emit('change', {setItems: items.map(item => this.getId(item))});
        }
    }

    public delete(...ids: string[]) {
        if (ids.length) {
            super.delete(...ids);
            this.eventTarget.emit('change', {deletedItems: ids});
        }
    }

    public deleteAll() {
        if (this.length) {
            const ids = this._items.items.keys();
            super.deleteAll();
            this.eventTarget.emit('change', {deletedItems: Array.from(ids)});
        }
    }

    public createMirror(): IndexedObjectCollection<T> {
        const copy = new ObservableIndexedObjectCollection<T>(this.id);
        copy.eventTarget = this.eventTarget;
        copy._items = this._items;
        return copy;
    }

    public on(eventName: 'change', handler: (ev?: CollectionEventMap<string>['change']) => void): this {
        this.eventTarget.on(eventName, handler);
        return this;
    }

    public once(eventName: 'change', handler: (ev?: CollectionEventMap<string>['change']) => void): this {
        this.eventTarget.once(eventName, handler);
        return this;
    }

    public off(eventName: string, handler: (ev?: CollectionEventMap<string>['change']) => void): this {
        this.eventTarget.off(eventName, handler);
        return this;
    }
}