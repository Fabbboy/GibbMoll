class Result<T, E> {
  _error: boolean;
  _value: T | E;

  public static error<T, E>(value: E): Result<T, E> {
    return new Result<T, E>(value, true);
  }

  public static ok<T, E>(value: T): Result<T, E> {
    return new Result<T, E>(value, false);
  }

  get isError() {
    return this._error;
  }

  get value() {
    return this._value;
  }

  unwarp(): T {
    if (this._error) {
      throw new Error('Cannot unwrap error: ' + this.value);
    }

    return this._value as T;
  }

  except(error: string): T {
    try {
      return this.unwarp();
    } catch (_) {
      throw new Error(error);
    }
  }

  private constructor(value: T | E, error: boolean) {
    this._value = value;
    this._error = error;
  }
}

export default Result;
