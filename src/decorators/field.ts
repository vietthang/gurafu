import 'reflect-metadata'
import 'source-map-support/register'

export interface FieldNameMap {
  [name: string]: string
}

const fieldNameMapSymbol = Symbol('fieldNameMap')

export function Field(name?: string): PropertyDecorator {
  return (target: Object, key: string) => {
    const fields: FieldNameMap = Reflect.getMetadata(fieldNameMapSymbol, target) || {}
    Reflect.defineMetadata(fieldNameMapSymbol, {
      ...fields,
      [key]: name || key,
    }, target)
  }
}

export function getFieldNameMap(target: Function): FieldNameMap | undefined {
  return Reflect.getMetadata(fieldNameMapSymbol, target.prototype)
}
