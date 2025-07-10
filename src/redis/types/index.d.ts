import { CACHE_NAMESPACE } from '../config';

export type SetCacheType<T = unknown> = {
  ns: CACHE_NAMESPACE;
  key: string;
  val: T;
  ttl?: number;
};

export type GetCacheType = {
  ns: CACHE_NAMESPACE;
  key: string;
};

export type DelCacheType = {
  ns: CACHE_NAMESPACE;
  key: string;
};
