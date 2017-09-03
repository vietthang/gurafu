const nameSymbol = Symbol('name')

export function ObjectType(name?: string): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(nameSymbol, name || target.name, target.prototype)
    // Object.assign(
    //   target,
    //   {
    //     resolveToInputType(): GraphQLInputType {
    //       return inputObjectTypeFactory(this)
    //     }

    //     resolveToOutputType(): GraphQLOutputType {
    //       return objectTypeFactory(this)
    //     }
    //   }
    // )
  }
}

export function getObjectTypeName(target: Function): string | undefined {
  return Reflect.getMetadata(nameSymbol, target.prototype)
}
