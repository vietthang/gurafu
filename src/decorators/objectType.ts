const nameSymbol = Symbol('name')

export function ObjectType(name?: string): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(nameSymbol, name || target.name, target.prototype)
  }
}

export function getObjectTypeName(target: Function): string | undefined {
  return Reflect.getMetadata(nameSymbol, target.prototype)
}
