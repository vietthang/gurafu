import 'reflect-metadata'
import 'mocha'
import * as assert from 'assert'

import { GraphQLNonNull, GraphQLString } from 'graphql'
import { NonNull } from './nonNull'

describe('Test @NonNull decorator', () => {
  it('Should resolve to TypeResolver correctly', () => {
    const resolver = NonNull(GraphQLString)
    assert.deepEqual(new GraphQLNonNull(GraphQLString), resolver.resolveToInputType())
    assert.deepEqual(new GraphQLNonNull(GraphQLString), resolver.resolveToOutputType())
  })
})
