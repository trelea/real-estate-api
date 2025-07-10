import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { DelCacheType, GetCacheType, SetCacheType } from './types';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async set<T = unknown>({ ns, key, val, ttl }: SetCacheType<T>): Promise<T> {
    return await this.cache.set<T>(`${ns}:${key}`, val, ttl);
  }

  async get<T = unknown>({ ns, key }: GetCacheType): Promise<T | null> {
    return await this.cache.get<T>(`${ns}:${key}`);
  }

  async del({ ns, key }: DelCacheType): Promise<boolean> {
    return await this.cache.del(`${ns}:${key}`);
  }

  async reset(): Promise<boolean> {
    return await this.cache.clear();
  }
}
