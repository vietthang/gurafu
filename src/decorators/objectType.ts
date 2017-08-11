import 'reflect-metadata'

const objectTypeNameSymbol = Symbol('objectTypeNameConfig')

export function ObjectType(name?: string): Function {
  return (target: Function) => {
    Reflect.defineMetadata(objectTypeNameSymbol, name || target.name, target.prototype)
  }
}

export function getObjectTypeName(target: Function): string | undefined {
  return Reflect.getMetadata(objectTypeNameSymbol, target.prototype)
}
