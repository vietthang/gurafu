import { GraphQLNonNull } from 'graphql'

import { TypeResolvable } from '../decorators/type'
import { getTypeResolver } from '../factory/typeFactory'
import { createGenericDecorator, TypeDecorator } from './common'

export const NonNull: TypeDecorator<TypeResolvable> = createGenericDecorator<TypeResolvable>((type) => ({
  resolveToInputType() {
    return new GraphQLNonNull(getTypeResolver(type).resolveToInputType())
  },
  resolveToOutputType() {
    return new GraphQLNonNull(getTypeResolver(type).resolveToOutputType())
  },
}))
