import { GraphQLScalarType, GraphQLObjectType, GraphQLError } from 'graphql'

import { createGenericDecorator, TypeDecorator } from './common'
import { once, Callable1 } from '../utils'
import { TypeResolver, TypeResolvable } from '../decorators/type'
import { getTypeResolver } from '../factory/typeFactory'

interface ResolvedGlobalId {
  type: string
  id: string
}

function base64Encode(str: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(str).toString('base64')
  }

  /* istanbul ignore next */
  if (typeof btoa !== 'undefined') {
    return btoa(str)
  }

  /* istanbul ignore next */
  throw new Error('Failed to encode string to base64')
}

function base64Decode(str: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(str, 'base64').toString()
  }

  /* istanbul ignore next */
  if (typeof atob !== 'undefined') {
    return atob(str)
  }

  /* istanbul ignore next */
  throw new Error('Failed to decode base64 string')
}

function fromGlobalId(globalId: string): ResolvedGlobalId {
  const [encodedType, encodedId] = globalId.split('.')
  return {
    type: base64Decode(encodedType),
    id: base64Decode(encodedId),
  }
}

/** @internal */
export function toGlobalId(type: string, id: string): string {
  return `${base64Encode(type)}.${base64Encode(id)}`
}

const resolveObjectTypeToID: Callable1<GraphQLObjectType, GraphQLScalarType> = once((objectType) => {
  return new GraphQLScalarType({
    name: objectType.name + 'ID',
    description: `ID of ${objectType.name}`,
    serialize(value: any) {
      if (typeof value !== 'string') {
        throw new GraphQLError('Invalid internal ID type, only string is supported')
      }
      return toGlobalId(objectType.name, value)
    },
    parseValue(value: any) {
      if (typeof value !== 'string') {
        throw new GraphQLError('Invalid public ID value, only string is supported')
      }
      const resolvedId = fromGlobalId(value)
      if (resolvedId.type !== objectType.name) {
        throw new GraphQLError(`Invalid ID type, got ${resolvedId.type} but ${objectType.name} needed`)
      }
      return resolvedId.id
    },
    parseLiteral(valueNode) {
      if (valueNode.kind !== 'StringValue') {
        throw new GraphQLError(
          'Invalid value node kind, only string is supported',
          [valueNode],
        )
      }
      const resolvedId = fromGlobalId(valueNode.value)
      if (resolvedId.type !== objectType.name) {
        throw new GraphQLError(
          `Invalid ID type, got ${resolvedId.type} but ${objectType.name} needed`,
          [valueNode],
        )
      }
      return resolvedId.id
    },
  })
})

const resolveToScalarType: Callable1<TypeResolver, GraphQLScalarType> = once((subTypeResolver) => {
  const type = subTypeResolver.resolveToOutputType()
  if (!(type instanceof GraphQLObjectType)) {
    throw new Error('Can not create ID type of type other than GraphQLObjectType')
  }
  return resolveObjectTypeToID(type)
})

export const ID: TypeDecorator<TypeResolvable> = createGenericDecorator((type) => ({
  resolveToInputType() {
    return resolveToScalarType(getTypeResolver(type))
  },
  resolveToOutputType() {
    return resolveToScalarType(getTypeResolver(type))
  },
}))
