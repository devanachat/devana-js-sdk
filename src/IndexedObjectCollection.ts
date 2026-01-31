import {EventHandler, EventTarget, ObservableInterface} from "./EventTarget";

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

export type CollectionEventMap<IdType = string> = {
    change: { setItems?: IdType[]; deletedItems?: IdType[] };
};

export class ObservableIndexedCollection<
    KeyT,
    ValueT,
    EventMapT extends CollectionEventMap<KeyT> = CollectionEventMap<KeyT>
> extends IndexedCollection<KeyT, ValueT> implements ObservableInterface<EventMapT> {

    protected eventTarget: EventTarget<EventMapT>;

    public constructor(items: [key: KeyT, value: ValueT][] = []) {
        super();
        this.eventTarget = new EventTarget<EventMapT>();
        this.set(...items);
    }

    public set(...items: [KeyT, ValueT][]) {
        if (items.length) {
            super.set(...items);
            this.eventTarget.emit('change', { setItems: items.map(item => item[0]) });
        }
    }

    public delete(...ids: KeyT[]) {
        if (ids.length) {
            super.delete(...ids);
            this.eventTarget.emit('change', { deletedItems: ids });
        }
    }

    public deleteAll() {
        if (this.length) {
            const ids = Array.from(this._items.keys());
            super.deleteAll();
            this.eventTarget.emit('change', { deletedItems: Array.from(ids) });
        }
    }

    public createMirror(): ObservableIndexedCollection<KeyT, ValueT, EventMapT> {
        const copy = new ObservableIndexedCollection<KeyT, ValueT, EventMapT>();
        copy.eventTarget = this.eventTarget;
        copy._items = this._items;
        return copy;
    }

    public on<K extends keyof EventMapT & string>(eventName: K, handler: EventHandler<EventMapT[K]>): this {
        this.eventTarget.on(eventName, handler);
        return this;
    }

    public once<K extends keyof EventMapT & string>(eventName: K, handler: EventHandler<EventMapT[K]>): this {
        this.eventTarget.once(eventName, handler);
        return this;
    }

    public off<K extends keyof EventMapT & string>(eventName: K, handler: EventHandler<EventMapT[K]>): this {
        this.eventTarget.off(eventName, handler);
        return this;
    }
}

export class ObservableIndexedObjectCollection<
    ItemT,
    EventMapT extends CollectionEventMap = CollectionEventMap
> extends IndexedObjectCollection<ItemT> implements ObservableInterface<EventMapT> {
    protected eventTarget: EventTarget<EventMapT>;

    public constructor(
        id: keyof ItemT | ((item: ItemT) => string),
        items: ItemT[] = [],
    ) {
        super(id);
        this.eventTarget = new EventTarget<EventMapT>();
        this.set(...items);
    }

    public set(...items: ItemT[]) {
        if (items.length) {
            super.set(...items);
            this.eventTarget.emit('change', { setItems: items.map(item => this.getId(item)) });
        }
    }

    public delete(...ids: string[]) {
        if (ids.length) {
            super.delete(...ids);
            this.eventTarget.emit('change', { deletedItems: ids });
        }
    }

    public deleteAll() {
        if (this.length) {
            const ids = this.items.map(item => this.getId(item));
            super.deleteAll();
            this.eventTarget.emit('change', { deletedItems: ids });
        }
    }

    public createMirror(): ObservableIndexedObjectCollection<ItemT, EventMapT> {
        const copy = new ObservableIndexedObjectCollection<ItemT, EventMapT>(this.id);
        copy.eventTarget = this.eventTarget;
        copy._items = this._items;
        return copy;
    }

    public on<EventName extends keyof EventMapT & string>(
        eventName: EventName,
        handler: EventHandler<EventMapT[EventName]>
    ): this {
        this.eventTarget.on(eventName, handler);
        return this;
    }

    public once<EventName extends keyof EventMapT & string>(
        eventName: EventName,
        handler: EventHandler<EventMapT[EventName]>
    ): this {
        this.eventTarget.once(eventName, handler);
        return this;
    }

    public off<EventName extends keyof EventMapT & string>(
        eventName: EventName,
        handler: EventHandler<EventMapT[EventName]>
    ): this {
        this.eventTarget.off(eventName, handler);
        return this;
    }
}