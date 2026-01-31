export type EventHandler<EventT> = (ev?: EventT) => void;
type HandlersMap = Map<string, EventHandler<any>[]>;
type EventMapLike = Record<string, any>;
type KnownEventNames<EventT> = EventT extends EventMapLike ? keyof EventT & string : string;
type EventPayload<EventT, EventName extends string = never> = EventT extends EventMapLike ? [EventName] extends [never] ? EventT[keyof EventT] : EventName extends keyof EventT ? EventT[EventName] : EventT[keyof EventT] : EventT;
export type ChangeEventMap<Payload = void> = {
    change: Payload;
};
export interface ObservableInterface<EventT = any> {
    on<EventName extends KnownEventNames<EventT>>(eventName: EventName, handler: EventHandler<EventPayload<EventT, EventName>>): this;
    on(eventName: string, handler: EventHandler<EventPayload<EventT>>): this;
    once<EventName extends KnownEventNames<EventT>>(eventName: EventName, handler: EventHandler<EventPayload<EventT, EventName>>): this;
    once(eventName: string, handler: EventHandler<EventPayload<EventT>>): this;
    off<EventName extends KnownEventNames<EventT>>(eventName: EventName, handler: EventHandler<EventPayload<EventT, EventName>>): this;
    off(eventName: string, handler: EventHandler<EventPayload<EventT>>): this;
}
export declare class EventTarget<EventMapT extends Record<string, any> = Record<string, any>> implements ObservableInterface<EventMapT> {
    protected events: HandlersMap;
    protected onceEvents: HandlersMap;
    on<K extends keyof EventMapT & string>(eventName: K, handler: EventHandler<EventMapT[K]>): this;
    on(eventName: string, handler: EventHandler<unknown>): this;
    once<K extends keyof EventMapT & string>(eventName: K, handler: EventHandler<EventMapT[K]>): this;
    once(eventName: string, handler: EventHandler<unknown>): this;
    off<K extends keyof EventMapT & string>(eventName: K, handler: EventHandler<EventMapT[K]>): this;
    off(eventName: string, handler: EventHandler<unknown>): this;
    emit<K extends keyof EventMapT & string>(eventName: K, event: EventMapT[K]): this;
    emit(eventName: string, event?: unknown): this;
    private addHandler;
    private callHandlers;
}
export {};
