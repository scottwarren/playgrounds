type Color = 'red' | 'blue';
type Quantity = 'one' | 'two';

export const stringLiteralTypes = <T extends `${Quantity} ${Color}`>(
  arg: T,
): `${Uppercase<T>} fish is done` => {
  return `${arg.toUpperCase() as Uppercase<T>} fish is done` as const;
};

export const toUpper = <T extends string>(arg: T[]): Uppercase<T>[] => {
  return arg.map(x => x.toUpperCase() as Uppercase<T>);
};

export const toUpperObjectKeys = <T extends {[key: string]: unknown}>(
  arg: T,
): {
  [K in keyof T as `what${Uppercase<string & K>}`]: T[K];
} => {
  const keys = Object.keys(arg) as (keyof T)[];
  // @ts-ignore
  return keys.reduce((acc, key) => {
    return {
      ...acc,
      [`what${key.toString().toUpperCase()}`]: arg[key],
    };
  }, {});
};

export const tail = <T extends any[]>(arr: readonly [any, ...T]) => {
  const [_ignored, ...rest] = arr;
  return rest;
};

type Strings = [string, string];
type Numbers = [number, number];

export type StrStrObjNumNumBool = [
  ...Strings,
  {what: null},
  ...Numbers,
  boolean,
];

const xxx: StrStrObjNumNumBool = ['', '', {what: null}, 2, 3, false];

type PropEventSource<T> = {
  on<K extends string & keyof T>(
    eventName: `${K}Changed`,
    callback: (newValue: T[K]) => void,
  ): void;
};

function makeWatchedObject<T>(obj: T): T & PropEventSource<T> {
  const watched: T & PropEventSource<T> = {
    ...obj,
    on: <K extends string & keyof T>(
      eventName: `${K}Changed`,
      callback: any,
    ) => {
      queueMicrotask(
        // @ts-ignore
        () => callback(obj[eventName.split('Changed')[0]]),
      );
    },
  };

  return watched;
}

let person = makeWatchedObject({
  firstName: 'Homer',
  age: 42,
  location: {
    x: 12,
    y: 24,
  },
});

person.on('firstNameChanged', newName => {
  console.log(newName);
});

person.on('ageChanged', newAge => {
  console.log(newAge);
});

person.on('locationChanged', location => {
  console.log(location);
});
