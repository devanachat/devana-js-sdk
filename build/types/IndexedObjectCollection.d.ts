import { EventHandler, EventTarget, ObservableInterface } from "./EventTarget";
export declare class IndexedCollection<KeyT, ValueT> {
    protected _items: Map<KeyT, ValueT>;
    constructor(items?: [key: KeyT, value: ValueT][]);
    get items(): Map<KeyT, ValueT>;
    get length(): number;
    set(...items: [KeyT, ValueT][]): void;
    get(id: KeyT): ValueT | undefined;
    has(id: KeyT): boolean;
    delete(...ids: KeyT[]): void;
    deleteAll(): void;
    findBy(field: keyof ValueT, valueToFind: any, limit?: number): IndexedCollection<KeyT, ValueT>;
    createMirror(): IndexedCollection<KeyT, ValueT>;
}
export declare class IndexedObjectCollection<T> {
    readonly id: keyof T | ((item: T) => any);
    protected _items: IndexedCollection<string, T>;
    constructor(id: keyof T | ((item: T) => any), items?: T[]);
    get items(): T[];
    get length(): number;
    set(...items: T[]): void;
    get(id: any): T | undefined;
    getAt(index: number): T | undefined;
    has(id: any): boolean;
    delete(...ids: any[]): void;
    deleteAll(): void;
    findBy(field: keyof T, valueToFind: any, limit?: number): IndexedObjectCollection<T>;
    createMirror(): IndexedObjectCollection<T>;
    protected getId(item: T): any;
}
export type CollectionEventMap<IdType = string> = {
    change: {
        setItems?: IdType[];
        deletedItems?: IdType[];
    };
};
export declare class ObservableIndexedCollection<KeyT, ValueT, EventMapT extends CollectionEventMap<KeyT> = CollectionEventMap<KeyT>> extends IndexedCollection<KeyT, ValueT> implements ObservableInterface<EventMapT> {
    protected eventTarget: EventTarget<EventMapT>;
    constructor(items?: [key: KeyT, value: ValueT][]);
    set(...items: [KeyT, ValueT][]): void;
    delete(...ids: KeyT[]): void;
    deleteAll(): void;
    createMirror(): ObservableIndexedCollection<KeyT, ValueT, EventMapT>;
    on<K extends keyof EventMapT & string>(eventName: K, handler: EventHandler<EventMapT[K]>): this;
    once<K extends keyof EventMapT & string>(eventName: K, handler: EventHandler<EventMapT[K]>): this;
    off<K extends keyof EventMapT & string>(eventName: K, handler: EventHandler<EventMapT[K]>): this;
}
export declare class ObservableIndexedObjectCollection<ItemT, EventMapT extends CollectionEventMap = CollectionEventMap> extends IndexedObjectCollection<ItemT> implements ObservableInterface<EventMapT> {
    protected eventTarget: EventTarget<EventMapT>;
    constructor(id: keyof ItemT | ((item: ItemT) => string), items?: ItemT[]);
    set(...items: ItemT[]): void;
    delete(...ids: string[]): void;
    deleteAll(): void;
    createMirror(): ObservableIndexedObjectCollection<ItemT, EventMapT>;
    on<EventName extends keyof EventMapT & string>(eventName: EventName, handler: EventHandler<EventMapT[EventName]>): this;
    once<EventName extends keyof EventMapT & string>(eventName: EventName, handler: EventHandler<EventMapT[EventName]>): this;
    off<EventName extends keyof EventMapT & string>(eventName: EventName, handler: EventHandler<EventMapT[EventName]>): this;
}
