import 'reflect-metadata'
import 'mocha'
import * as assert from 'assert'

import { Nil, GraphQLNil } from './nil'

describe('Test @Nil decorator', () => {
  it('Should resolve to GraphQLNil correctly', () => {
    const resolver = Nil()
    assert.deepEqual(GraphQLNil, resolver.resolveToInputType())
    assert.deepEqual(GraphQLNil, resolver.resolveToOutputType())
  })

  it('Should serial/parse GraphQLNil from any value to null', () => {
    assert.equal(null, GraphQLNil.serialize({}))
    assert.equal(null, GraphQLNil.serialize(''))
    assert.equal(null, GraphQLNil.serialize(0))
    assert.equal(null, GraphQLNil.serialize(undefined))
    assert.equal(null, GraphQLNil.serialize(null))

    assert.equal(null, GraphQLNil.parseValue({}))
    assert.equal(null, GraphQLNil.parseValue(''))
    assert.equal(null, GraphQLNil.parseValue(0))
    assert.equal(null, GraphQLNil.parseValue(undefined))
    assert.equal(null, GraphQLNil.parseValue(null))

    assert.equal(null, GraphQLNil.parseLiteral({
      kind: 'StringValue',
      value: '',
    }))
    assert.equal(null, GraphQLNil.parseLiteral({
      kind: 'IntValue',
      value: '',
    }))
  })
})
