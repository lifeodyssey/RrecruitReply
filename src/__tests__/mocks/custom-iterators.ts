/**
 * Custom iterator implementations for mocking web APIs in tests
 */

// Add a simple test to prevent the "no tests" error
describe('Custom Iterators', () => {
  it('MapIterator works correctly', () => {
    const array = [1, 2, 3, 4, 5];
    const iterator = new MapIterator(array[Symbol.iterator]());

    // Test map
    const doubled = iterator.map((x) => x * 2).toArray();
    expect(doubled).toEqual([2, 4, 6, 8, 10]);
  });
});

// Import the types from the dom-extensions.d.ts file
// Define the interfaces directly in this file
interface IIteratorExtensions<T> {
  map<U>(
    callbackfn: (value: T, index: number) => U
  ): HeadersIterator<U> | MapIterator<U> | FormDataIterator<U>;
  filter(
    predicate: (value: T, index: number) => boolean
  ): HeadersIterator<T> | MapIterator<T> | FormDataIterator<T>;
  take(count: number): HeadersIterator<T> | MapIterator<T> | FormDataIterator<T>;
  drop(count: number): HeadersIterator<T> | MapIterator<T> | FormDataIterator<T>;
  forEach(callbackfn: (value: T, index: number) => void): void;
  toArray(): T[];
  flatMap<U>(
    callbackfn: (value: T, index: number) => U | U[]
  ): HeadersIterator<U> | MapIterator<U> | FormDataIterator<U>;
  reduce<V>(
    callbackfn: (previousValue: V, currentValue: T, currentIndex: number) => V,
    initialValue: V
  ): V;
  some(predicate: (value: T, index: number) => boolean): boolean;
  every(predicate: (value: T, index: number) => boolean): boolean;
}

// Custom HeadersIterator implementation
export class HeadersIterator<T> implements Iterator<T>, IIteratorExtensions<T> {
  private iterator: Iterator<T>;

  constructor(iterator: Iterator<T>) {
    this.iterator = iterator;
  }

  next(value?: unknown): IteratorResult<T> {
    return this.iterator.next(value);
  }

  // Additional methods required by HeadersIterator
  map<U>(callbackfn: (value: T, index: number) => U): HeadersIterator<U> {
    const values: U[] = [];
    let result = this.iterator.next();
    let index = 0;

    while (!result.done) {
      values.push(callbackfn(result.value, index++));
      result = this.iterator.next();
    }

    return new HeadersIterator<U>(values[Symbol.iterator]());
  }

  filter(predicate: (value: T, index: number) => boolean): HeadersIterator<T> {
    const values: T[] = [];
    let result = this.iterator.next();
    let index = 0;

    while (!result.done) {
      if (predicate(result.value, index++)) {
        values.push(result.value);
      }
      result = this.iterator.next();
    }

    return new HeadersIterator<T>(values[Symbol.iterator]());
  }

  take(count: number): HeadersIterator<T> {
    const values: T[] = [];
    let result = this.iterator.next();
    let index = 0;

    while (!result.done && index < count) {
      values.push(result.value);
      result = this.iterator.next();
      index++;
    }

    return new HeadersIterator<T>(values[Symbol.iterator]());
  }

  drop(count: number): HeadersIterator<T> {
    const values: T[] = [];
    let result = this.iterator.next();
    let index = 0;

    // Skip the first 'count' elements
    while (!result.done && index < count) {
      result = this.iterator.next();
      index++;
    }

    // Add the remaining elements
    while (!result.done) {
      values.push(result.value);
      result = this.iterator.next();
    }

    return new HeadersIterator<T>(values[Symbol.iterator]());
  }

  // Add other required methods
  forEach(callbackfn: (value: T, index: number) => void): void {
    let result = this.iterator.next();
    let index = 0;

    while (!result.done) {
      callbackfn(result.value, index++);
      result = this.iterator.next();
    }
  }

  toArray(): T[] {
    const values: T[] = [];
    let result = this.iterator.next();

    while (!result.done) {
      values.push(result.value);
      result = this.iterator.next();
    }

    return values;
  }

  // Implement missing methods required by IteratorExtensions
  flatMap<U>(callbackfn: (value: T, index: number) => U | U[]): HeadersIterator<U> {
    const values: U[] = [];
    let result = this.iterator.next();
    let index = 0;

    while (!result.done) {
      const mapped = callbackfn(result.value, index++);
      if (Array.isArray(mapped)) {
        values.push(...mapped);
      } else {
        values.push(mapped);
      }
      result = this.iterator.next();
    }

    return new HeadersIterator<U>(values[Symbol.iterator]());
  }

  reduce<U>(
    callbackfn: (previousValue: U, currentValue: T, currentIndex: number) => U,
    initialValue: U
  ): U {
    let accumulator = initialValue;
    let result = this.iterator.next();
    let index = 0;

    while (!result.done) {
      accumulator = callbackfn(accumulator, result.value, index++);
      result = this.iterator.next();
    }

    return accumulator;
  }

  some(predicate: (value: T, index: number) => boolean): boolean {
    let result = this.iterator.next();
    let index = 0;

    while (!result.done) {
      if (predicate(result.value, index++)) {
        return true;
      }
      result = this.iterator.next();
    }

    return false;
  }

  every(predicate: (value: T, index: number) => boolean): boolean {
    let result = this.iterator.next();
    let index = 0;

    while (!result.done) {
      if (!predicate(result.value, index++)) {
        return false;
      }
      result = this.iterator.next();
    }

    return true;
  }

  [Symbol.iterator](): HeadersIterator<T> {
    return this;
  }
}

// Custom MapIterator implementation for Map-like objects
export class MapIterator<T> implements Iterator<T>, IIteratorExtensions<T> {
  // Add Symbol.toStringTag and Symbol.dispose
  readonly [Symbol.toStringTag]: string = 'MapIterator';
  [Symbol.dispose](): void {
    // No-op implementation
  }

  // Add find method
  find(predicate: (value: T, index: number) => boolean): T | undefined {
    let result = this.iterator.next();
    let index = 0;

    while (!result.done) {
      if (predicate(result.value, index++)) {
        return result.value;
      }
      result = this.iterator.next();
    }

    return undefined;
  }
  private iterator: Iterator<T>;

  constructor(iterator: Iterator<T>) {
    this.iterator = iterator;
  }

  next(value?: unknown): IteratorResult<T> {
    return this.iterator.next(value);
  }

  // Additional methods required by MapIterator
  map<U>(callbackfn: (value: T, index: number) => U): MapIterator<U> {
    const values: U[] = [];
    let result = this.iterator.next();
    let index = 0;

    while (!result.done) {
      values.push(callbackfn(result.value, index++));
      result = this.iterator.next();
    }

    return new MapIterator<U>(values[Symbol.iterator]());
  }

  filter(predicate: (value: T, index: number) => boolean): MapIterator<T> {
    const values: T[] = [];
    let result = this.iterator.next();
    let index = 0;

    while (!result.done) {
      if (predicate(result.value, index++)) {
        values.push(result.value);
      }
      result = this.iterator.next();
    }

    return new MapIterator<T>(values[Symbol.iterator]());
  }

  take(count: number): MapIterator<T> {
    const values: T[] = [];
    let result = this.iterator.next();
    let index = 0;

    while (!result.done && index < count) {
      values.push(result.value);
      result = this.iterator.next();
      index++;
    }

    return new MapIterator<T>(values[Symbol.iterator]());
  }

  drop(count: number): MapIterator<T> {
    const values: T[] = [];
    let result = this.iterator.next();
    let index = 0;

    // Skip the first 'count' elements
    while (!result.done && index < count) {
      result = this.iterator.next();
      index++;
    }

    // Add the remaining elements
    while (!result.done) {
      values.push(result.value);
      result = this.iterator.next();
    }

    return new MapIterator<T>(values[Symbol.iterator]());
  }

  // Add other required methods
  forEach(callbackfn: (value: T, index: number) => void): void {
    let result = this.iterator.next();
    let index = 0;

    while (!result.done) {
      callbackfn(result.value, index++);
      result = this.iterator.next();
    }
  }

  toArray(): T[] {
    const values: T[] = [];
    let result = this.iterator.next();

    while (!result.done) {
      values.push(result.value);
      result = this.iterator.next();
    }

    return values;
  }

  // Implement missing methods required by IteratorExtensions
  flatMap<U>(callbackfn: (value: T, index: number) => U | U[]): MapIterator<U> {
    const values: U[] = [];
    let result = this.iterator.next();
    let index = 0;

    while (!result.done) {
      const mapped = callbackfn(result.value, index++);
      if (Array.isArray(mapped)) {
        values.push(...mapped);
      } else {
        values.push(mapped);
      }
      result = this.iterator.next();
    }

    return new MapIterator<U>(values[Symbol.iterator]());
  }

  reduce<U>(
    callbackfn: (previousValue: U, currentValue: T, currentIndex: number) => U,
    initialValue: U
  ): U {
    let accumulator = initialValue;
    let result = this.iterator.next();
    let index = 0;

    while (!result.done) {
      accumulator = callbackfn(accumulator, result.value, index++);
      result = this.iterator.next();
    }

    return accumulator;
  }

  some(predicate: (value: T, index: number) => boolean): boolean {
    let result = this.iterator.next();
    let index = 0;

    while (!result.done) {
      if (predicate(result.value, index++)) {
        return true;
      }
      result = this.iterator.next();
    }

    return false;
  }

  every(predicate: (value: T, index: number) => boolean): boolean {
    let result = this.iterator.next();
    let index = 0;

    while (!result.done) {
      if (!predicate(result.value, index++)) {
        return false;
      }
      result = this.iterator.next();
    }

    return true;
  }

  [Symbol.iterator](): MapIterator<T> {
    return this;
  }
}

// Custom FormDataIterator implementation
export class FormDataIterator<T> implements Iterator<T>, IIteratorExtensions<T> {
  // Add Symbol.toStringTag and Symbol.dispose
  readonly [Symbol.toStringTag]: string = 'FormDataIterator';
  [Symbol.dispose](): void {
    // No-op implementation
  }

  // Add find method
  find(predicate: (value: T, index: number) => boolean): T | undefined {
    let result = this.iterator.next();
    let index = 0;

    while (!result.done) {
      if (predicate(result.value, index++)) {
        return result.value;
      }
      result = this.iterator.next();
    }

    return undefined;
  }
  private iterator: Iterator<T>;

  constructor(iterator: Iterator<T>) {
    this.iterator = iterator;
  }

  next(value?: unknown): IteratorResult<T> {
    return this.iterator.next(value);
  }

  // Additional methods required by FormDataIterator
  map<U>(callbackfn: (value: T, index: number) => U): FormDataIterator<U> {
    const values: U[] = [];
    let result = this.iterator.next();
    let index = 0;

    while (!result.done) {
      values.push(callbackfn(result.value, index++));
      result = this.iterator.next();
    }

    return new FormDataIterator<U>(values[Symbol.iterator]());
  }

  filter(predicate: (value: T, index: number) => boolean): FormDataIterator<T> {
    const values: T[] = [];
    let result = this.iterator.next();
    let index = 0;

    while (!result.done) {
      if (predicate(result.value, index++)) {
        values.push(result.value);
      }
      result = this.iterator.next();
    }

    return new FormDataIterator<T>(values[Symbol.iterator]());
  }

  take(count: number): FormDataIterator<T> {
    const values: T[] = [];
    let result = this.iterator.next();
    let index = 0;

    while (!result.done && index < count) {
      values.push(result.value);
      result = this.iterator.next();
      index++;
    }

    return new FormDataIterator<T>(values[Symbol.iterator]());
  }

  drop(count: number): FormDataIterator<T> {
    const values: T[] = [];
    let result = this.iterator.next();
    let index = 0;

    // Skip the first 'count' elements
    while (!result.done && index < count) {
      result = this.iterator.next();
      index++;
    }

    // Add the remaining elements
    while (!result.done) {
      values.push(result.value);
      result = this.iterator.next();
    }

    return new FormDataIterator<T>(values[Symbol.iterator]());
  }

  // Add other required methods
  forEach(callbackfn: (value: T, index: number) => void): void {
    let result = this.iterator.next();
    let index = 0;

    while (!result.done) {
      callbackfn(result.value, index++);
      result = this.iterator.next();
    }
  }

  toArray(): T[] {
    const values: T[] = [];
    let result = this.iterator.next();

    while (!result.done) {
      values.push(result.value);
      result = this.iterator.next();
    }

    return values;
  }

  // Implement missing methods required by IteratorExtensions
  flatMap<U>(callbackfn: (value: T, index: number) => U | U[]): FormDataIterator<U> {
    const values: U[] = [];
    let result = this.iterator.next();
    let index = 0;

    while (!result.done) {
      const mapped = callbackfn(result.value, index++);
      if (Array.isArray(mapped)) {
        values.push(...mapped);
      } else {
        values.push(mapped);
      }
      result = this.iterator.next();
    }

    return new FormDataIterator<U>(values[Symbol.iterator]());
  }

  reduce<U>(
    callbackfn: (previousValue: U, currentValue: T, currentIndex: number) => U,
    initialValue: U
  ): U {
    let accumulator = initialValue;
    let result = this.iterator.next();
    let index = 0;

    while (!result.done) {
      accumulator = callbackfn(accumulator, result.value, index++);
      result = this.iterator.next();
    }

    return accumulator;
  }

  some(predicate: (value: T, index: number) => boolean): boolean {
    let result = this.iterator.next();
    let index = 0;

    while (!result.done) {
      if (predicate(result.value, index++)) {
        return true;
      }
      result = this.iterator.next();
    }

    return false;
  }

  every(predicate: (value: T, index: number) => boolean): boolean {
    let result = this.iterator.next();
    let index = 0;

    while (!result.done) {
      if (!predicate(result.value, index++)) {
        return false;
      }
      result = this.iterator.next();
    }

    return true;
  }

  [Symbol.iterator](): FormDataIterator<T> {
    return this;
  }
}
