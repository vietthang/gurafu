import 'reflect-metadata'
import {
  GraphQLType,
  GraphQLInputType,
  GraphQLOutputType,
  GraphQLScalarType,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLUnionType,
  GraphQLEnumType,
  GraphQLInterfaceType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLString,
} from 'graphql'
import * as GraphQLDate from 'graphql-date'

import { objectTypeFactory, inputObjectTypeFactory } from '../factory/objectTypeFactory'

const typeSymbol = Symbol('type')

const parameterTypesSymbol = Symbol('parameterTypes')

export interface GraphQLTypeResolver {
  resolveToInputType(): GraphQLInputType
  resolveToOutputType(): GraphQLOutputType
}

export type TypeResolvable = GraphQLTypeResolver | GraphQLType | Function

export function createTypeResolver(type: TypeResolvable): GraphQLTypeResolver {
  const anyType: any = type
  if (anyType.resolveToInputType && anyType.resolveToOutputType) {
    return anyType
  }

  if (typeof type === 'function') {
    switch (type) {
      case Boolean:
        return createTypeResolver(GraphQLBoolean)
      case Number:
        return createTypeResolver(GraphQLFloat)
      case String:
        return createTypeResolver(GraphQLString)
      case Date:
        return createTypeResolver(GraphQLDate)
      case Object:
        throw new Error('Failed to resolve GraphQLType. The design type are too generic.')
    }

    return {
      resolveToInputType() {
        return inputObjectTypeFactory(type)
      },
      resolveToOutputType() {
        return objectTypeFactory(type)
      },
    }
  }

  if (type instanceof GraphQLScalarType) {
    return {
      resolveToInputType() {
        return type
      },
      resolveToOutputType() {
        return type
      },
    }
  }

  if (type instanceof GraphQLObjectType) {
    return {
      resolveToInputType(): GraphQLInputType {
        throw new Error('Can not convert GraphQLObjectType to input type')
      },
      resolveToOutputType() {
        return type
      },
    }
  }

  if (type instanceof GraphQLInputObjectType) {
    return {
      resolveToInputType() {
        return type
      },
      resolveToOutputType(): GraphQLOutputType {
        throw new Error('Can not convert GraphQLInputObjectType to output type')
      },
    }
  }

  if (type instanceof GraphQLEnumType) {
    return {
      resolveToInputType() {
        return type
      },
      resolveToOutputType() {
        return type
      },
    }
  }

  if (type instanceof GraphQLUnionType) {
    return {
      resolveToInputType(): GraphQLInputType {
        throw new Error('Can not convert GraphQLUnionType to input type')
      },
      resolveToOutputType() {
        return type
      },
    }
  }

  if (type instanceof GraphQLInterfaceType) {
    return {
      resolveToInputType(): GraphQLInputType {
        throw new Error('Can not convert GraphQLInterfaceType to input type')
      },
      resolveToOutputType() {
        return type
      },
    }
  }

  if (type instanceof GraphQLNonNull) {
    return {
      resolveToInputType() {
        return type
      },
      resolveToOutputType() {
        return type
      },
    }
  }

  if (type instanceof GraphQLList) {
    return {
      resolveToInputType() {
        return type
      },
      resolveToOutputType() {
        return type
      },
    }
  }

  throw new Error('Can not create type resolver')
}

export function Type(type: TypeResolvable): Function {
  return (target: Object, key: string, index?: number) => {
    if (index !== undefined) {
      const parameterTypes = Reflect.getMetadata(parameterTypesSymbol, target) || {}
      Reflect.defineMetadata(parameterTypesSymbol, {
        ...parameterTypes,
        [index]: createTypeResolver(type),
      }, target, key!)
    } else {
      Reflect.defineMetadata(typeSymbol, createTypeResolver(type), target, key)
    }
  }
}

export function getTypeResolver(target: Function, key: string, index?: number): GraphQLTypeResolver | undefined {
  if (index === undefined) {
    return Reflect.getMetadata(typeSymbol, target.prototype, key)
  } else {
    return (Reflect.getMetadata(parameterTypesSymbol, target.prototype, key) || {})[index]
  }
}

export function List(type: TypeResolvable): Function & GraphQLTypeResolver {
  const subTypeResolver = createTypeResolver(type)
  const typeResolver = {
    resolveToInputType() {
      return new GraphQLList(subTypeResolver.resolveToInputType())
    },
    resolveToOutputType() {
      return new GraphQLList(subTypeResolver.resolveToOutputType())
    },
  }
  return Object.assign(
    (target: Object, key: string, index?: number) => {
      return Type(typeResolver)(target, key, index)
    },
    typeResolver,
  )
}

export function NonNull(type: TypeResolvable): Function & GraphQLTypeResolver {
  const subTypeResolver = createTypeResolver(type)
  const typeResolver = {
    resolveToInputType() {
      return new GraphQLNonNull(subTypeResolver.resolveToInputType())
    },
    resolveToOutputType() {
      return new GraphQLNonNull(subTypeResolver.resolveToOutputType())
    },
  }
  return Object.assign(
    (target: Object, key: string, index?: number) => {
      return Type(typeResolver)(target, key, index)
    },
    typeResolver,
  )
}
