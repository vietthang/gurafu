import * as assert from 'assert'
import { GraphQLScalarType, GraphQLObjectType, ValueNode } from 'graphql'
import { fromGlobalId, toGlobalId } from 'graphql-relay'

import { once, Callable1 } from '../utils'
import { Type, TypeResolver, createTypeResolver, TypeResolvable } from '../decorators/type'

const resolveObjectTypeToID: Callable1<GraphQLObjectType, GraphQLScalarType> = once((objectType) => {
  return new GraphQLScalarType({
    name: objectType.name + 'ID',
    description: `ID of ${objectType.name}`,
    serialize(value: any) {
      assert(typeof value === 'string')
      return toGlobalId(objectType.name, value)
    },
    parseValue(value: any) {
      assert(typeof value === 'string')
      const resolvedId = fromGlobalId(value)
      if (resolvedId.type !== objectType.name) {
        throw new Error(`Invalid ID type, got ${resolvedId.type} but ${objectType.name} needed`)
      }
      return resolvedId.id
    },
    parseLiteral(valueNode: ValueNode) {
      if (valueNode.kind !== 'StringValue') {
        throw new Error('Invalid value node kind, only string is supported')
      }
      const resolvedId = fromGlobalId(valueNode.value)
      if (resolvedId.type !== objectType.name) {
        throw new Error(`Invalid ID type, got ${resolvedId.type} but ${objectType.name} needed`)
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

export function ID(type: TypeResolvable): Function & TypeResolver {
  const subTypeResolver = createTypeResolver(type)
  const typeResolver = {
    resolveToInputType() {
      return once(resolveToScalarType)(subTypeResolver)
    },
    resolveToOutputType() {
      return once(resolveToScalarType)(subTypeResolver)
    },
  }
  return Object.assign(
    (target: Object, key: string, index?: number) => {
      return Type(typeResolver)(target, key, index)
    },
    typeResolver,
  )
}
