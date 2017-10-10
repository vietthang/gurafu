const interfaceNameSymbol = Symbol('interfaceName')

export function Interface(interfaceName?: string): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(interfaceNameSymbol, interfaceName || target.name, target.prototype)
  }
}

export function getInterfaceName(target: Function): string | undefined {
  return Reflect.getMetadata(interfaceNameSymbol, target.prototype)
}
