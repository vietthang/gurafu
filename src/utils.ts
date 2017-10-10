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

const FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m
const FN_ARG_SPLIT = /,/
const FN_ARG = /^\s*(_?)(.+?)\1\s*$/
const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg

export type InjectableFunction = Function & { $inject?: string[] }

export type OneOrArray<T> = T | Array<T>

export function getFunctionArgs(fn: InjectableFunction) {
  if (!fn.$inject) {
    const fnText = fn.toString().replace(STRIP_COMMENTS, '')
    const argDecl = fnText.match(FN_ARGS)
    fn.$inject = argDecl![1].split(FN_ARG_SPLIT).map((arg: string) => {
      return arg.replace(FN_ARG, (all: string, ...matches: string[]) => {
        return matches[1]
      })
    })
  }

  return fn.$inject
}
