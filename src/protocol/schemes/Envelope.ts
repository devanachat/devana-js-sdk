export interface Envelope<T = any> {
    type: string;
    ref?: string;
    data: T;
}