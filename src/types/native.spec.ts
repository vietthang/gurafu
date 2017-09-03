import 'reflect-metadata'
import 'mocha'
import * as assert from 'assert'
import { GraphQLString, GraphQLBoolean, GraphQLFloat, GraphQLInt } from 'graphql'

import { String, Boolean, Float, Int } from './native'

describe('Test @String/@Boolean/@Float/@Int decorator', () => {
  it('Should resolve using @String correctly', () => {
    const resolver = String()
    assert.deepEqual(GraphQLString, resolver.resolveToInputType())
    assert.deepEqual(GraphQLString, resolver.resolveToOutputType())
  })

  it('Should resolve using @Boolean correctly', () => {
    const resolver = Boolean()
    assert.deepEqual(GraphQLBoolean, resolver.resolveToInputType())
    assert.deepEqual(GraphQLBoolean, resolver.resolveToOutputType())
  })

  it('Should resolve using @Float correctly', () => {
    const resolver = Float()
    assert.deepEqual(GraphQLFloat, resolver.resolveToInputType())
    assert.deepEqual(GraphQLFloat, resolver.resolveToOutputType())
  })

  it('Should resolve using @Int correctly', () => {
    const resolver = Int()
    assert.deepEqual(GraphQLInt, resolver.resolveToInputType())
    assert.deepEqual(GraphQLInt, resolver.resolveToOutputType())
  })
})
