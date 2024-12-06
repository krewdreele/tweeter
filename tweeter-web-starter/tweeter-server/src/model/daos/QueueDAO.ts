export interface QueueDAO<T> {
    sendToQueue(url: string, body: T): Promise<void>;
}