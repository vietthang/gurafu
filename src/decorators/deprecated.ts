import 'reflect-metadata'

const deprecationReasonSymbol = Symbol('deprecationReason')

export function Deprecated(deprecationReason: string = 'Deprecated'): PropertyDecorator {
  return (target: Object, key: string) => {
    Reflect.defineMetadata(deprecationReasonSymbol, deprecationReason, target, key)
  }
}

export function getDepricationReason(target: Function, key: string): string | undefined {
  return Reflect.getMetadata(deprecationReasonSymbol, target.prototype, key)
}
