/**
 * Extensions to DOM types for testing
 */

interface FormDataIterator<T> extends Iterator<T> {
  map<U>(callbackfn: (value: T, index: number) => U): FormDataIterator<U>;
  filter(predicate: (value: T, index: number) => boolean): FormDataIterator<T>;
  take(count: number): FormDataIterator<T>;
  drop(count: number): FormDataIterator<T>;
  forEach(callbackfn: (value: T, index: number) => void): void;
  toArray(): T[];
  [Symbol.iterator](): FormDataIterator<T>;
  flatMap<U>(callbackfn: (value: T, index: number) => U | U[]): FormDataIterator<U>;
  reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number) => U, initialValue: U): U;
  some(predicate: (value: T, index: number) => boolean): boolean;
  every(predicate: (value: T, index: number) => boolean): boolean;
}

interface MapIterator<T> extends Iterator<T> {
  map<U>(callbackfn: (value: T, index: number) => U): MapIterator<U>;
  filter(predicate: (value: T, index: number) => boolean): MapIterator<T>;
  take(count: number): MapIterator<T>;
  drop(count: number): MapIterator<T>;
  forEach(callbackfn: (value: T, index: number) => void): void;
  toArray(): T[];
  [Symbol.iterator](): MapIterator<T>;
  flatMap<U>(callbackfn: (value: T, index: number) => U | U[]): MapIterator<U>;
  reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number) => U, initialValue: U): U;
  some(predicate: (value: T, index: number) => boolean): boolean;
  every(predicate: (value: T, index: number) => boolean): boolean;
}

interface HeadersIterator<T> extends Iterator<T> {
  map<U>(callbackfn: (value: T, index: number) => U): HeadersIterator<U>;
  filter(predicate: (value: T, index: number) => boolean): HeadersIterator<T>;
  take(count: number): HeadersIterator<T>;
  drop(count: number): HeadersIterator<T>;
  forEach(callbackfn: (value: T, index: number) => void): void;
  toArray(): T[];
  [Symbol.iterator](): HeadersIterator<T>;
  flatMap<U>(callbackfn: (value: T, index: number) => U | U[]): HeadersIterator<U>;
  reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number) => U, initialValue: U): U;
  some(predicate: (value: T, index: number) => boolean): boolean;
  every(predicate: (value: T, index: number) => boolean): boolean;
}

// Extend FormData interface
interface FormData {
  entries(): FormDataIterator<[string, FormDataEntryValue]>;
  keys(): FormDataIterator<string>;
  values(): FormDataIterator<FormDataEntryValue>;
  [Symbol.iterator](): FormDataIterator<[string, FormDataEntryValue]>;
}

// Extend Map interface for RequestCookies
interface Map<K, V> {
  entries(): MapIterator<[K, V]>;
  keys(): MapIterator<K>;
  values(): MapIterator<V>;
  [Symbol.iterator](): MapIterator<[K, V]>;
}

// Extend Headers interface
interface Headers {
  entries(): HeadersIterator<[string, string]>;
  keys(): HeadersIterator<string>;
  values(): HeadersIterator<string>;
  [Symbol.iterator](): HeadersIterator<[string, string]>;
}

// Define NextURL internal symbol
interface NextURLInternal {
  basePath: string;
  buildId: string;
  locale: string | undefined;
  defaultLocale: string | undefined;
}

// Define NextRequest internal symbol
interface NextRequestInternal {
  cookies: Map<string, string>;
  nextUrl: URL;
  ip?: string;
  geo?: { city?: string; country?: string; region?: string };
  ua?: { isBot: boolean };
}

// Define Internal symbol
declare const Internal: unique symbol;

// Extend NextURL interface
interface NextURL extends URL {
  basePath: string;
  buildId: string;
  locale: string;
  defaultLocale: string;
  domainLocale?: { domain: string; defaultLocale: string; locales: string[] };
  [Symbol.for('NextURLInternal')]: NextURLInternal;
  [Internal]: Record<string, unknown>;
  clone(): NextURL;
  analyze(): { pathname: string; search: string; hash: string };
  formatPathname(): string;
  formatSearch(): string;
}

// Define INTERNALS symbol
declare const INTERNALS: unique symbol;

// Extend NextRequest interface
interface NextRequest extends Request {
  nextUrl: NextURL;
  cookies: Map<string, string>;
  ip: string;
  geo: { city?: string; country?: string; region?: string };
  ua: { isBot: boolean };
  page: { name?: string; params?: Record<string, string> };
  [Symbol.for('NextRequestInternal')]: NextRequestInternal;
  [INTERNALS]: Record<string, unknown>;
}
