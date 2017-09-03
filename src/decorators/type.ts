import {
  GraphQLType,
  GraphQLInputType,
  GraphQLOutputType,
} from 'graphql'

const typeSymbol = Symbol('type')

const parameterTypesSymbol = Symbol('parameterTypes')

export type Thunk<T> = T | (() => T)

export interface TypeResolver {
  resolveToInputType(): GraphQLInputType
  resolveToOutputType(): GraphQLOutputType
}

export type EmptyObjectConstructor = new () => object

export type TypeResolvable = Thunk<
  TypeResolver
  | GraphQLType
  | EmptyObjectConstructor
  | StringConstructor
  | NumberConstructor
  | BooleanConstructor
>

export function Type(type: TypeResolvable): Function {
  return (target: Object, key: string, index?: number | PropertyDescriptor) => {
    if (typeof index === 'number') {
      const parameterTypes = Reflect.getMetadata(parameterTypesSymbol, target, key) || {}
      Reflect.defineMetadata(parameterTypesSymbol, {
        ...parameterTypes,
        [index]: type,
      }, target, key)
    } else {
      Reflect.defineMetadata(typeSymbol, type, target, key)
    }
  }
}

export function getType(target: Function, key: string, index?: number): TypeResolvable | undefined {
  if (index === undefined) {
    return Reflect.getMetadata(typeSymbol, target.prototype, key)
  } else {
    return (Reflect.getMetadata(parameterTypesSymbol, target.prototype, key) || {})[index]
  }
}
