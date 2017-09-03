import { GraphQLObjectType, GraphQLInputType, GraphQLList, GraphQLNonNull, GraphQLInt } from 'graphql'

import { createGenericDecorator, TypeDecorator } from './common'
import { once, Callable1 } from '../utils'
import { TypeResolvable } from '../decorators/type'
import { getTypeResolver } from '../factory/typeFactory'

const PagingType = new GraphQLObjectType({
  name: 'Paging',
  fields: {
    limit: { type: GraphQLInt },
    offset: { type: GraphQLInt },
    total: { type: GraphQLInt },
  },
})

const resolveObjectTypeToCollection: Callable1<GraphQLObjectType, GraphQLObjectType> = once((subType) => {
  return new GraphQLObjectType({
    name: `${subType.name}Collection`,
    fields: {
      paging: { type: PagingType },
      items: { type: new GraphQLList(new GraphQLNonNull(subType)) },
    },
  })
})

export const Collection: TypeDecorator<TypeResolvable> = createGenericDecorator((type) => ({
  resolveToInputType(): GraphQLInputType {
    throw new Error('Collection type can not be used as input type')
  },
  resolveToOutputType() {
    const subType = getTypeResolver(type).resolveToOutputType()
    if (!(subType instanceof GraphQLObjectType)) {
      throw new Error('Can not create ID type of type other than GraphQLObjectType')
    }
    return resolveObjectTypeToCollection(subType)
  },
}))
