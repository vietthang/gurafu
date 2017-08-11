import 'reflect-metadata'

import { Field } from './field'

const typeSymbol = Symbol('type')

export function Mutation(name?: string): PropertyDecorator {
  return (target, key) => {
    const oldType = Reflect.getMetadata(typeSymbol, target, key)
    if (oldType) {
      throw new Error(`Key ${key} has been decorated with ${oldType} already`)
    }
    Field(name)(target, key)
    Reflect.defineMetadata(typeSymbol, '@Mutation', target, key)
  }
}

export function Query(name?: string): PropertyDecorator {
  return (target, key) => {
    const oldType = Reflect.getMetadata(typeSymbol, target, key)
    if (oldType) {
      throw new Error(`Key ${key} has been decorated with ${oldType} already`)
    }
    Field(name)(target, key)
    Reflect.defineMetadata(typeSymbol, '@Query', target, key)
  }
}

export function Subscription(name?: string): PropertyDecorator {
  return (target, key) => {
    const oldType = Reflect.getMetadata(typeSymbol, target, key)
    if (oldType) {
      throw new Error(`Key ${key} has been decorated with ${oldType} already`)
    }
    Field(name)(target, key)
    Reflect.defineMetadata(typeSymbol, '@Subscription', target, key)
  }
}

export function getType(target: Function, key: string): '@Mutation' | '@Query' | '@Subscription' | undefined {
  return Reflect.getMetadata(typeSymbol, target.prototype, key)
}
