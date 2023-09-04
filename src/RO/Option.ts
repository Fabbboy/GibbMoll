export type Option<T> = Some<T> | typeof None;

export class Some<T> {
  constructor(public value: T) {}
}

export const None = Symbol('None');

export function isSome<T>(option: Option<T>): option is Some<T> {
  return typeof option !== 'symbol';
}

export function isNone<T>(option: Option<T>): option is typeof None {
  return option === None;
}

export function from<T>(value: T): Option<T> {
  if (value === undefined || value === null) {
    return None;
  }
  return new Some(value);
}

export function unwrap<T>(option: Option<T>): T {
  if (isNone(option)) {
    throw new Error('Cannot unwrap None');
  }
  return option.value;
}
