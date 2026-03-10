interface CacheRecord<Value> {
  expiresAt: number;
  value: Value;
}

export class MemoryCache<Value> {
  private readonly cache = new Map<string, CacheRecord<Value>>();

  constructor(private readonly ttlMs: number) {}

  get(key: string): Value | undefined {
    const record = this.cache.get(key);

    if (!record) {
      return undefined;
    }

    if (record.expiresAt < Date.now()) {
      this.cache.delete(key);
      return undefined;
    }

    return record.value;
  }

  set(key: string, value: Value): void {
    this.cache.set(key, {
      expiresAt: Date.now() + this.ttlMs,
      value,
    });
  }
}
