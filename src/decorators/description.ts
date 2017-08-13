import 'reflect-metadata'
import * as assert from 'assert'

const descriptionSymbol = Symbol('description')

const parametersDescriptionSymbol = Symbol('parameterDefaults')

export function Description(description: string): Function {
  return (target: any, key?: string, index?: number | PropertyDescriptor) => {
    assert(typeof target === 'object' || typeof target === 'function')
    if (typeof target === 'function') {
      Reflect.defineMetadata(descriptionSymbol, description, target.prototype)
    } else {
      assert(typeof key === 'string')
      if (typeof index === 'number') {
        const parametersDescription = Reflect.getMetadata(parametersDescriptionSymbol, target) || {}
        Reflect.defineMetadata(parametersDescriptionSymbol, {
          ...parametersDescription,
          [index]: description,
        }, target, key!)
      } else {
        Reflect.defineMetadata(descriptionSymbol, description, target, key!)
      }
    }
  }
}

export function getDescription(target: Function, key?: string, index?: number): string | undefined {
  if (key === undefined) {
    return Reflect.getMetadata(descriptionSymbol, target.prototype)
  } else if (index === undefined) {
    return Reflect.getMetadata(descriptionSymbol, target.prototype, key)
  } else {
    return (Reflect.getMetadata(parametersDescriptionSymbol, target.prototype, key) || {})[index]
  }
}
