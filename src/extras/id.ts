import * as assert from 'assert'
import { GraphQLScalarType, GraphQLScalarTypeConfig, GraphQLObjectType, ValueNode } from 'graphql'
import { fromGlobalId, toGlobalId } from 'graphql-relay'

import { once } from '../utils'
import { Type, GraphQLTypeResolver, createTypeResolver, TypeResolvable } from '../decorators/type'

function resolveToScalarType(subTypeResolver: GraphQLTypeResolver): GraphQLScalarType {
  const type = subTypeResolver.resolveToOutputType()
  if (!(type instanceof GraphQLObjectType)) {
    throw new Error('Can not create ID type of type other than GraphQLObjectType')
  }
  return new GraphQLScalarType({
    name: type.name + 'ID',
    description: `ID of ${type.name}`,
    serialize(value: any) {
      assert(typeof value === 'string')
      return toGlobalId(type.name, value)
    },
    parseValue(value: any) {
      assert(typeof value === 'string')
      const resolvedId = fromGlobalId(value)
      if (resolvedId.type !== type.name) {
        throw new Error(`Invalid ID type, got ${resolvedId.type} but ${type.name} needed`)
      }
      return resolvedId.id
    },
    parseLiteral(valueNode: ValueNode) {
      if (valueNode.kind !== 'StringValue') {
        throw new Error('Invalid value node kind, only string is supported')
      }
      const resolvedId = fromGlobalId(valueNode.value)
      if (resolvedId.type !== type.name) {
        throw new Error(`Invalid ID type, got ${resolvedId.type} but ${type.name} needed`)
      }
      return resolvedId.id
    },
  } as GraphQLScalarTypeConfig<string, string>)
}

export function ID(type: TypeResolvable): Function & GraphQLTypeResolver {
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
