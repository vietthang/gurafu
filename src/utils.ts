export interface Callable1<T, U> {
  (arg0: T): U
}

export function once<T extends object, U>(callable: Callable1<T, U>): Callable1<T, U> {
  const functionCache = new WeakMap<any, any>()

  return (arg0: T): U => {
    let cachedResult = functionCache.get(arg0)
    if (!cachedResult) {
      cachedResult = callable(arg0)
      functionCache.set(arg0, cachedResult)
    }
    return cachedResult
  }
}
