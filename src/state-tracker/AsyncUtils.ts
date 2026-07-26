import {IndexedCollection} from "../IndexedObjectCollection";

export class DeferredTask {
    public readonly promise: Promise<void>;
    public resolve: () => void;

    public constructor() {
        this.promise = new Promise<void>((resolve) => this.resolve = resolve);
    }
}

export class PromiseRegistry {
    private promises = new IndexedCollection<string, Promise<any>>();

    public register<T = any>(promise: Promise<T>, key: string): void {
        this.promises.set([key, promise]);

        promise.catch(() => {
            if (this.promises.get(key) === promise) {
                this.promises.delete(key);
            }
        });
    }

    public registerByFunction(fn: () => Promise<any>, key: string): void {
        this.register(fn(), key);
    }

    public get<T = any>(key: string): Promise<T> | undefined {
        return this.promises.get(key);
    }

    public has(key: string): boolean {
        return this.promises.has(key);
    }

    public notExist(key: string): boolean {
        return ! this.has(key);
    }

    public forget(...keys: string[]): void {
        this.promises.delete(...keys);
    }

    public forgetAll(): void {
        this.promises.deleteAll();
    }
}