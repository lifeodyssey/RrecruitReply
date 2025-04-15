/**
 * Extensions to DOM types for testing
 */

interface IFormDataIterator<T> extends Iterator<T> {
  map<U>(callbackfn: (value: T, index: number) => U): IFormDataIterator<U>;
  filter(predicate: (value: T, index: number) => boolean): IFormDataIterator<T>;
  take(count: number): IFormDataIterator<T>;
  drop(count: number): IFormDataIterator<T>;
  forEach(callbackfn: (value: T, index: number) => void): void;
  toArray(): T[];
  [Symbol.iterator](): IFormDataIterator<T>;
}

interface IMapIterator<T> extends Iterator<T> {
  map<U>(callbackfn: (value: T, index: number) => U): IMapIterator<U>;
  filter(predicate: (value: T, index: number) => boolean): IMapIterator<T>;
  take(count: number): IMapIterator<T>;
  drop(count: number): IMapIterator<T>;
  forEach(callbackfn: (value: T, index: number) => void): void;
  toArray(): T[];
  [Symbol.iterator](): IMapIterator<T>;
}

interface IHeadersIterator<T> extends Iterator<T> {
  map<U>(callbackfn: (value: T, index: number) => U): IHeadersIterator<U>;
  filter(predicate: (value: T, index: number) => boolean): IHeadersIterator<T>;
  take(count: number): IHeadersIterator<T>;
  drop(count: number): IHeadersIterator<T>;
  forEach(callbackfn: (value: T, index: number) => void): void;
  toArray(): T[];
  [Symbol.iterator](): IHeadersIterator<T>;
}

// Extend FormData interface
interface IFormData {
  entries(): IFormDataIterator<[string, FormDataEntryValue]>;
  keys(): IFormDataIterator<string>;
  values(): IFormDataIterator<FormDataEntryValue>;
  [Symbol.iterator](): IFormDataIterator<[string, FormDataEntryValue]>;
}

// Extend Map interface for RequestCookies
interface IMap<K, V> {
  entries(): IMapIterator<[K, V]>;
  keys(): IMapIterator<K>;
  values(): IMapIterator<V>;
  [Symbol.iterator](): IMapIterator<[K, V]>;
}

// Extend Headers interface
interface IHeaders {
  entries(): IHeadersIterator<[string, string]>;
  keys(): IHeadersIterator<string>;
  values(): IHeadersIterator<string>;
  [Symbol.iterator](): IHeadersIterator<[string, string]>;
}

// Define NextURL internal symbol
interface INextURLInternal {
  basePath: string;
  buildId: string;
  locale: string | undefined;
  defaultLocale: string | undefined;
}

// Define NextRequest internal symbol
interface INextRequestInternal {
  cookies: Map<string, string>;
  nextUrl: URL;
  ip?: string;
  geo?: { city?: string; country?: string; region?: string };
  ua?: { isBot: boolean };
}

// Extend NextURL interface
interface INextURL extends URL {
  basePath: string;
  buildId: string;
  locale: string;
  defaultLocale: string;
  domainLocale?: { domain: string; defaultLocale: string; locales: string[] };
  [Symbol.for('NextURLInternal')]: INextURLInternal;
  clone(): INextURL;
}

// Extend NextRequest interface
interface INextRequest extends Request {
  nextUrl: INextURL;
  cookies: IMap<string, string>;
  ip: string;
  geo: { city?: string; country?: string; region?: string };
  ua: { isBot: boolean };
  page: { name?: string; params?: Record<string, string> };
  [Symbol.for('NextRequestInternal')]: NextRequestInternal;
}
