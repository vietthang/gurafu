export interface Callable1<T, U> {
  (arg0: T): U
}

const internalCache = new WeakMap<any, WeakMap<any, any>>()

export function once<T extends object, U>(callable: Callable1<T, U>): Callable1<T, U> {
  let functionCache = internalCache.get(callable)
  if (!functionCache) {
    functionCache = new WeakMap<any, any>()
  }
  internalCache.set(callable, functionCache)
  return (arg0: T): U => {
    let cachedResult = functionCache!.get(arg0)
    if (!cachedResult) {
      cachedResult = callable(arg0)
      functionCache!.set(arg0, cachedResult)
    }
    return cachedResult
  }
}
