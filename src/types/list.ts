import { GraphQLList } from 'graphql'

import { TypeResolvable } from '../decorators/type'
import { getTypeResolver } from '../factory/typeFactory'
import { createGenericDecorator, TypeDecorator } from './common'

export const List: TypeDecorator<TypeResolvable> = createGenericDecorator<TypeResolvable>((type) => ({
  resolveToInputType() {
    return new GraphQLList(getTypeResolver(type).resolveToInputType())
  },
  resolveToOutputType() {
    return new GraphQLList(getTypeResolver(type).resolveToOutputType())
  },
}))
