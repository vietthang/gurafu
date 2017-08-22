import { GraphQLObjectType, GraphQLInputType, GraphQLList, GraphQLNonNull, GraphQLInt } from 'graphql'

import { once, Callable1 } from '../utils'
import { Type, TypeResolver, createTypeResolver, TypeResolvable } from '../decorators/type'

const PagingType = new GraphQLObjectType({
  name: 'Paging',
  fields: {
    limit: { type: GraphQLInt },
    offset: { type: GraphQLInt },
    total: { type: GraphQLInt },
  },
})

const resolveToCollection: Callable1<TypeResolver, GraphQLObjectType> = once((subTypeResolver) => {
  const subType = subTypeResolver.resolveToOutputType()
  if (!(subType instanceof GraphQLObjectType)) {
    throw new Error('Can not create ID type of type other than GraphQLObjectType')
  }
  return new GraphQLObjectType({
    name: `${subType.name}Collection`,
    fields: {
      paging: { type: PagingType },
      items: { type: new GraphQLList(new GraphQLNonNull(subType)) },
    },
  })
})

export function Collection(type: TypeResolvable): Function & TypeResolver {
  const subTypeResolver = createTypeResolver(type)
  const typeResolver = {
    resolveToInputType(): GraphQLInputType {
      throw new Error('Collection type can not be used as input type')
    },
    resolveToOutputType() {
      return resolveToCollection(subTypeResolver)
    },
  }
  return Object.assign(
    (target: Object, key: string, index?: number) => {
      return Type(typeResolver)(target, key, index)
    },
    typeResolver,
  )
}
