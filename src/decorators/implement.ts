import { Thunk } from 'graphql'

const implementsSymbol = Symbol('implements')

export function Implement(...interfaces: Thunk<Function | Function[]>[]): ClassDecorator {
  return (target) => {
    const storedInterfaces: Thunk<Function | Function[]>[] = Reflect.getMetadata(implementsSymbol, target.prototype) || []
    Reflect.defineMetadata(implementsSymbol, storedInterfaces.concat(interfaces), target.prototype)
  }
}

export function getInterfaces(target: Function): Thunk<Function | Function[]>[] {
  return Reflect.getMetadata(implementsSymbol, target.prototype) || []
}
