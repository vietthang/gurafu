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

export const getFunctionArgs = once((fn: Function) => {
  const fnText = fn.toString().replace(STRIP_COMMENTS, '')
  const argDecl = fnText.match(FN_ARGS)
  return argDecl![1].split(FN_ARG_SPLIT).map((arg: string) => {
    return arg.replace(FN_ARG, (all: string, ...matches: string[]) => {
      return matches[1]
    })
  })
})

export type Constructor = (...args: any[]) => any

export interface DecoratorMatcher {

  memberProperty?(target: Constructor, key: string): void

  memberMethod?(target: Constructor, key: string): void

  memberMethodArg?(target: Constructor, key: string, index: number): void

  staticProperty?(target: Constructor, key: string): void

  staticMethod?(target: Constructor, key: string): void

  staticMethodArg?(target: Constructor, key: string, index: number): void

  staticInnerClass?(target: Constructor, key: string, innerClass: Constructor): void

  standaloneClass?(target: Constructor): void

}

export function decoratorMatch(
  target: Object | Function,
  key: string | undefined,
  valueOrIndex: number | PropertyDescriptor | undefined,
  matcher: DecoratorMatcher,
) {
  if (typeof target === 'function') {
    if (key === undefined) {
      if (matcher.standaloneClass) {
        return matcher.standaloneClass(target)
      }

      throw new Error('This decorator is not a standalone class decorator')
    }

    if (valueOrIndex === undefined) {
      if (typeof (target as any)[key] === 'function') {
        if (matcher.staticInnerClass) {
          matcher.staticInnerClass(target, key, (target as any)[key])
        }

        throw new Error('This decorator is not a static inner class decorator')
      }

      if (matcher.staticProperty) {
        matcher.staticProperty(target, key)
      }

      throw new Error('This decorator is not a static property decorator')
    }

    if (typeof valueOrIndex === 'number') {
      if (matcher.staticMethodArg) {
        return matcher.staticMethodArg(target, key, valueOrIndex)
      }

      throw new Error('This decorator is not a static method argument decorator')
    }

    if (typeof valueOrIndex.value === 'function' && valueOrIndex.configurable === false) {
      if (matcher.staticMethod) {
        return matcher.staticMethod(target, key)
      }

      throw new Error('This decorator is not a member method decorator')
    }

    throw new Error('Nothing matched')
  }

  if (typeof target === 'object') {
    if (key === undefined) {
      throw new Error('Invalid case')
    }

    if (valueOrIndex === undefined) {
      if (matcher.memberProperty) {
        return matcher.memberProperty(target.constructor, key)
      }

      throw new Error('This decorator is not a member property decorator')
    }

    if (typeof valueOrIndex === 'number') {
      if (matcher.memberMethodArg) {
        return matcher.memberMethodArg(target.constructor, key, valueOrIndex)
      }

      throw new Error('This decorator is not a member method argument decorator')
    }

    if (typeof valueOrIndex.value === 'function' && valueOrIndex.configurable === false) {
      if (matcher.memberMethod) {
        return matcher.memberMethod(target.constructor, key)
      }

      throw new Error('This decorator is not a member method decorator')
    }

    throw new Error('Nothing matched')
  }
}
