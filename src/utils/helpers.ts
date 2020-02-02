import { CURRENCY } from './constants';

export function isPlainObject(object: any): object is object {
  return object !== null && typeof object === 'object' && (object.constructor === Object || object.constructor === null);
}

export function mapObject<T = object>(fun: (value: any, key?: string) => any, object: object): T {
  const cache = new WeakMap();

  function traverseObject(object: object, objectKey: string | undefined, f: (value: any, key?: string) => any): any {
    if (Array.isArray(object)) {
      return object.map((item, i) => {
        if (cache.has(item)) {
          return cache.get(item);
        }
        const traversedObject = traverseObject(item, String(i), f);
        cache.set(item, traversedObject);
        return traversedObject;
      });
    } else if (isPlainObject(object)) {
      return Object.entries(object)
        .map(entry => {
          const itemKey = entry[0];
          const item = entry[1];
          if (cache.has(item)) {
            return [itemKey, cache.get(item)];
          }
          const traversedObject = traverseObject(item, itemKey, f);

          if (isPlainObject(item)) {
            cache.set(item, traversedObject);
          }

          return [itemKey, traversedObject];
        })
        .reduce((prev, curr) => {
          prev[curr[0]] = curr[1];
          return prev;
        }, {});
    } else {
      return f(object, objectKey);
    }
  }

  return traverseObject(object, undefined, fun);
}

// round to 2 decimal places and fix floating point inaccuracy
export function round2(number: number) {
  return Math.round(Number((number * 100).toFixed(2))) / 100;
}

export function formatNumberToDisplay(number: number) {
  return number.toFixed(2).replace('.', ',');
}

export function formatNumberToCurrency(number: number) {
  return formatNumberToDisplay(number) + ' ' + CURRENCY;
}
