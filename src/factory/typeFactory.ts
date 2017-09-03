import {
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

import { objectTypeFactory, inputObjectTypeFactory } from './objectTypeFactory'
import { TypeResolvable, TypeResolver } from '../decorators/type'
import { getObjectTypeName } from '../decorators/objectType'
import { once, Callable1 } from '../utils'

export const getTypeResolver: Callable1<TypeResolvable, TypeResolver> = once((type) => {
  const anyType: any = type
  if (anyType.resolveToInputType && anyType.resolveToOutputType) {
    return anyType
  }

  if (typeof type === 'function') {
    // resolve some native types
    switch (type) {
      case Boolean:
        return getTypeResolver(GraphQLBoolean)
      case Number:
        return getTypeResolver(GraphQLFloat)
      case String:
        return getTypeResolver(GraphQLString)
    }

    if (type.prototype && getObjectTypeName(type) !== undefined) {
      return {
        resolveToInputType() {
          return inputObjectTypeFactory(type)

        },
        resolveToOutputType() {
          return objectTypeFactory(type)
        },
      }
    }

    // input is a thunk, call with no argument and feed to createTypeResolver
    return {
      resolveToInputType() {
        return getTypeResolver((type as Function)()).resolveToInputType()
      },
      resolveToOutputType() {
        return getTypeResolver((type as Function)()).resolveToOutputType()
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
})
