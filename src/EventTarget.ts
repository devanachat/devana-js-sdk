export type EventHandler<EventT> = (ev?: EventT) => void;
type HandlersMap = Map<string, EventHandler<any>[]>;
type EventMapLike = Record<string, any>;
type KnownEventNames<EventT> = EventT extends EventMapLike ? keyof EventT & string : string;
type EventPayload<EventT, EventName extends string = never> = EventT extends EventMapLike
    ? [EventName] extends [never]
        ? EventT[keyof EventT]
        : EventName extends keyof EventT
            ? EventT[EventName]
            : EventT[keyof EventT]
    : EventT;

export type ChangeEventMap<Payload = void> = { change: Payload };

export interface ObservableInterface<EventT = any> {
    on<EventName extends KnownEventNames<EventT>>(eventName: EventName, handler: EventHandler<EventPayload<EventT, EventName>>): this;
    on(eventName: string, handler: EventHandler<EventPayload<EventT>>): this;
    once<EventName extends KnownEventNames<EventT>>(eventName: EventName, handler: EventHandler<EventPayload<EventT, EventName>>): this;
    once(eventName: string, handler: EventHandler<EventPayload<EventT>>): this;
    off<EventName extends KnownEventNames<EventT>>(eventName: EventName, handler: EventHandler<EventPayload<EventT, EventName>>): this;
    off(eventName: string, handler: EventHandler<EventPayload<EventT>>): this;
}

export class EventTarget<EventT = any> implements ObservableInterface<EventT> {
    protected events: HandlersMap = new Map<string, EventHandler<any>[]>();
    protected onceEvents: HandlersMap = new Map<string, EventHandler<any>[]>();

    public on<EventName extends KnownEventNames<EventT>>(eventName: EventName, handler: EventHandler<EventPayload<EventT, EventName>>): this;
    public on(eventName: string, handler: EventHandler<EventPayload<EventT>>): this;
    public on(eventName: string, handler: EventHandler<EventPayload<EventT>>): this {
        this.addHandler(this.events, eventName, handler);
        return this;
    }

    public once<EventName extends KnownEventNames<EventT>>(eventName: EventName, handler: EventHandler<EventPayload<EventT, EventName>>): this;
    public once(eventName: string, handler: EventHandler<EventPayload<EventT>>): this;
    public once(eventName: string, handler: EventHandler<EventPayload<EventT>>): this {
        this.addHandler(this.onceEvents, eventName, handler);
        return this;
    }

    public off<EventName extends KnownEventNames<EventT>>(eventName: EventName, handler: EventHandler<EventPayload<EventT, EventName>>): this;
    public off(eventName: string, handler: EventHandler<EventPayload<EventT>>): this;
    public off(eventName: string, handler: EventHandler<EventPayload<EventT>>): this {
        const index = this.events.get(eventName)?.indexOf(handler);
        if (!index || index < 0) {
            return this;
        }
        this.events.get(eventName)?.splice(index, 1);
        return this;
    }

    public emit<EventName extends KnownEventNames<EventT>>(eventName: EventName, event?: EventPayload<EventT, EventName>): this;
    public emit(eventName: string, event?: EventPayload<EventT>): this;
    public emit(eventName: string, event?: EventPayload<EventT>): this {
        this.callHandlers(this.events, eventName, event);
        this.callHandlers(this.onceEvents, eventName, event);
        this.onceEvents.delete(eventName);
        return this;
    }

    private addHandler(map: HandlersMap, eventName: string, handler: EventHandler<any>): void {
        const handlers = map.get(eventName) ?? [];
        handlers.push(handler);
        map.set(eventName, handlers);
    }

    private callHandlers(map: HandlersMap, eventName: string, event: unknown): void {
        map.get(eventName)?.forEach(callback => callback(event));
    }
}