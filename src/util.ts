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
export const noop = (...args: any[]) => {};

// tslint:disable-next-line:no-any
export const mergeObjects = <T extends {}>(items: T[]) => {
  // merges the items into a single object using reduce
  return items.reduce((p, c) => Object.assign(p, c), {}) as T;
};

/**
 * Batches sequential function calls
 * @param time wait time in milliseconds
 * @param cb callback function called on timeout
 * @param merge merge function to use
 * @returns A function that batches calls until timeout
 */
export const batch = <T>(time: number, cb: ((a: T) => void), merge: ((q: T[]) => T) = mergeObjects) => {
  const queue: T[] = [];
  let handle: number;

  const start = () => {
    handle = window.setTimeout(() => {
      const final = merge(queue);
      cb(final);
    },                         time);
  };

  const func = (a: T) => {
    queue.push(a);

    if (handle) {
      clearTimeout(handle);
    }

    start();
  };

  return func;
};
