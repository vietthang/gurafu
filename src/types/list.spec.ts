import 'reflect-metadata'
import 'mocha'
import * as assert from 'assert'

import { GraphQLList, GraphQLString } from 'graphql'
import { List } from './list'

describe('Test @List decorator', () => {
  it('Should resolve to TypeResolver correctly', () => {
    const resolver = List(GraphQLString)
    assert.deepEqual(new GraphQLList(GraphQLString), resolver.resolveToInputType())
    assert.deepEqual(new GraphQLList(GraphQLString), resolver.resolveToOutputType())
  })
})
