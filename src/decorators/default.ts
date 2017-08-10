import 'reflect-metadata'
import * as assert from 'assert'

const defaultSymbol = Symbol('default')

const parameterDefaultsSymbol = Symbol('parameterDefaults')

export function Default(defaultValue: any): Function {
  return (target: any, key: string, index?: number) => {
    assert(typeof target === 'object')
    assert(typeof key === 'string')
    if (index === undefined) {
      Reflect.defineMetadata(defaultSymbol, defaultValue, target, key)
    } else {
      const parametersDefault = Reflect.getMetadata(parameterDefaultsSymbol, target) || {}
      Reflect.defineMetadata(parameterDefaultsSymbol, {
        ...parametersDefault,
        [index]: defaultValue,
      }, target, key)
    }
  }
}

export function getDefault(target: Function, key: string, index?: number): any | undefined {
  if (index === undefined) {
    return Reflect.getMetadata(defaultSymbol, target.prototype, key)
  } else {
    return (Reflect.getMetadata(parameterDefaultsSymbol, target.prototype, key) || {})[index]
  }
}
