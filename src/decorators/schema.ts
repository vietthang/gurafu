import { Field } from './field'

const schemaMethodKindSymbol = Symbol('schemaMethodKind')

export function Mutation(name?: string): Function {
  return (target: any, key: string) => {
    const oldType = Reflect.getMetadata(schemaMethodKindSymbol, target, key)
    if (oldType) {
      throw new Error(`Key ${key} has been decorated with ${oldType} already`)
    }
    Field(name)(target, key)
    Reflect.defineMetadata(schemaMethodKindSymbol, '@Mutation', target, key)
    if (target[key] && typeof target[key] === 'function') {
      return {
        value: target[key].bind(target),
      }
    }

    return undefined
  }
}

export function Query(name?: string): Function {
  return (target: any, key: string) => {
    const oldType = Reflect.getMetadata(schemaMethodKindSymbol, target, key)
    if (oldType) {
      throw new Error(`Key ${key} has been decorated with ${oldType} already`)
    }
    Field(name)(target, key)
    Reflect.defineMetadata(schemaMethodKindSymbol, '@Query', target, key)
    if (target[key] && typeof target[key] === 'function') {
      return {
        value: target[key].bind(target),
      }
    }

    return undefined
  }
}

export function Subscription(name?: string): Function {
  return (target: any, key: string) => {
    const oldType = Reflect.getMetadata(schemaMethodKindSymbol, target, key)
    if (oldType) {
      throw new Error(`Key ${key} has been decorated with ${oldType} already`)
    }
    Field(name)(target, key)
    Reflect.defineMetadata(schemaMethodKindSymbol, '@Subscription', target, key)
    if (target[key] && typeof target[key] === 'function') {
      return {
        value: target[key].bind(target),
      }
    }

    return undefined
  }
}

export function getType(target: Function, key: string): '@Mutation' | '@Query' | '@Subscription' | undefined {
  return Reflect.getMetadata(schemaMethodKindSymbol, target.prototype, key)
}
