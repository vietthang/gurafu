import { GraphQLType, GraphQLObjectType, GraphQLInputType } from 'graphql'
import { connectionDefinitions } from 'graphql-relay'

import { once } from '../utils'
import { Type, GraphQLTypeResolver, createTypeResolver } from '../decorators/type'

function resolveToConnectionDefinitions(subTypeResolver: GraphQLTypeResolver) {
  const type = subTypeResolver.resolveToOutputType()
  if (!(type instanceof GraphQLObjectType)) {
    throw new Error('Can not create ID type of type other than GraphQLObjectType')
  }
  return connectionDefinitions({
    nodeType: type,
  })
}

export function Connection(type: GraphQLType | Function | GraphQLTypeResolver): Function & GraphQLTypeResolver {
  const subTypeResolver = createTypeResolver(type)
  const typeResolver = {
    resolveToInputType(): GraphQLInputType {
      throw new Error('Connection type can not be used as input type')
    },
    resolveToOutputType() {
      return once(resolveToConnectionDefinitions)(subTypeResolver).connectionType
    },
  }
  return Object.assign(
    (target: Object, key: string, index?: number) => {
      return Type(typeResolver)(target, key, index)
    },
    typeResolver,
  )
}

export function Edge(type: GraphQLType | Function | GraphQLTypeResolver): Function & GraphQLTypeResolver {
  const subTypeResolver = createTypeResolver(type)
  const typeResolver = {
    resolveToInputType(): GraphQLInputType {
      throw new Error('Edge type can not be used as input type')
    },
    resolveToOutputType() {
      return once(resolveToConnectionDefinitions)(subTypeResolver).edgeType
    },
  }
  return Object.assign(
    (target: Object, key: string, index?: number) => {
      return Type(typeResolver)(target, key, index)
    },
    typeResolver,
  )
}
