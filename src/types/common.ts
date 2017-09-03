import { Type, TypeResolvable, TypeResolver } from '../decorators/type'
import { getTypeResolver } from '../factory/typeFactory'

export type TypeDecorator<T> = (value: T) => Function & TypeResolver

export function createGenericDecorator<T>(fn: (v: T) => TypeResolvable): TypeDecorator<T> {
  return (value: T) => {
    const type = fn(value)

    return Object.assign(
      (...args: any[]) => {
        return Type(type)(...args)
      },
      getTypeResolver(type),
    )
  }
}

export type TypeDecoratorVoid = () => Function & TypeResolver

export function createDecorator(type: TypeResolvable): TypeDecoratorVoid {
  return () => {
    return Object.assign(
      (...args: any[]) => {
        return Type(type)(...args)
      },
      getTypeResolver(type),
    )
  }
}
