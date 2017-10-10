import { TypeResolvable, Type } from './type'

export interface FieldNameMap {
  [name: string]: string
}

const fieldNameMapSymbol = Symbol('fieldNameMap')

export function Field(name?: string): PropertyDecorator

export function Field(name: string, type: TypeResolvable): PropertyDecorator

export function Field(type: TypeResolvable): PropertyDecorator

export function Field(arg0?: TypeResolvable | string, arg1?: TypeResolvable): PropertyDecorator {
  let name: string | undefined
  let type: TypeResolvable | undefined

  if (typeof arg0 === 'string') {
    name = arg0
  } else {
    type = arg0
  }

  if (arg1 !== undefined) {
    type = arg1
  }

  return (target: Object, key: string) => {
    const fields: FieldNameMap = Reflect.getMetadata(fieldNameMapSymbol, target) || {}
    Reflect.defineMetadata(fieldNameMapSymbol, {
      ...fields,
      [key]: name || key,
    }, target)
    if (type) {
      Type(type)(target, key)
    }
  }
}

export function getFieldNameMap(target: Function): FieldNameMap | undefined {
  return Reflect.getMetadata(fieldNameMapSymbol, target.prototype)
}
