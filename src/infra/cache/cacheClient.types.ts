export interface CacheClient {
  get<T>(key: string): Promise<T | undefined> | T | undefined;
  set<T>(key: string, value: T, ttl?: number): void | Promise<void>;
  del(key: string): void | Promise<void>;
  getTtl(key: string): Promise<number>;
  flushAll(): void | Promise<void>;
}