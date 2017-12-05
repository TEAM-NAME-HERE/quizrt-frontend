import { Diff } from 'react-redux';

export const areEqualObj = <T extends {}>(a: T, b: T) => {
  const aProps = Object.getOwnPropertyNames(a);
  const bProps = Object.getOwnPropertyNames(b);
  if (aProps.length !== bProps.length) {
    return false;
  }

  for (const key in a) {
    if (a.hasOwnProperty(key)) {
      if (a[key] !== b[key]) {
        return false;
      }
    }
  }

  return true;
};

export const isNewItem = (item: string) => {
  return item === '' || item.indexOf('new:') >= 0;
};

export const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

// tslint:disable-next-line:no-empty no-any
export const noop = (...args: any[]) => new Promise<any>((resolve) => resolve());

// tslint:disable-next-line:no-any
export const mergeObjects = <T extends {}>(items: T[]) => {
  // merges the items into a single object using reduce
  return items.reduce((p, c) => Object.assign(p, c), {}) as T;
};

export class DeferredPromise<T> {
  resolve: (value?: T | PromiseLike<T> | undefined) => void;
  // tslint:disable-next-line:no-any
  reject: (reason?: any) => void;
  promise: Promise<T>;
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

/**
 * Batches sequential function calls
 * @param time wait time in milliseconds
 * @param cb callback function called on timeout
 * @param merge merge function to use
 * @returns A function that batches calls until timeout
 */
// tslint:disable-next-line:no-any
export const batch = <T, B>(time: number, cb: ((a: T) => Promise<B>), merge: ((q: T[]) => T) = mergeObjects) => {
  let queue: T[] = [];
  let promiseQueue: DeferredPromise<B>[] = [];
  let handle: number;

  const resetState = () => {
    queue = [];
    promiseQueue = [];
  };

  const start = () => {
      handle = window.setTimeout(() => {
        const final = merge(queue);
        cb(final).then(a => {
          promiseQueue.forEach(p => p.resolve(a));
          resetState();
        }).catch(r => {
          promiseQueue.forEach(p => p.reject(r));
          resetState();
        });
      },                         time);
  };

  /**
   * Batches calls until timeout
   * @param a The input data
   * @returns A promise which resolves when callback is called
   */
  const func = (a: T) => {
    queue.push(a);
    const promise = new DeferredPromise<B>();
    promiseQueue.push(promise);

    if (handle) {
      clearTimeout(handle);
    }

    start();
    return promise.promise;
  };

  return func;
};

export const notEmpty = <T>(value: T | null | undefined): value is T => {
  return value !== null || value !== undefined;
};

export type Overwrite<T, U> = { [P in Diff<keyof T, keyof U>]: T[P] } & U;
