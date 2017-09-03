import 'reflect-metadata'
import 'mocha'
import * as assert from 'assert'
import { GraphQLError } from 'graphql'

import { DateTime, GraphQLDateTime } from './dateTime'

describe('Test @DateTime decorator', () => {
  it('Should resolve to GraphQLDateTime correctly', () => {
    const resolver = DateTime()
    assert.deepEqual(GraphQLDateTime, resolver.resolveToInputType())
    assert.deepEqual(GraphQLDateTime, resolver.resolveToOutputType())
  })

  it('Should serial/parse GraphQLDateTime correctly', () => {
    const now = new Date()
    assert.throws(() => GraphQLDateTime.serialize({}), GraphQLError)
    assert.throws(() => GraphQLDateTime.serialize({}), GraphQLError)
    assert.equal(now.getTime(), GraphQLDateTime.serialize(now))

    assert.throws(() => GraphQLDateTime.parseValue({}), GraphQLError)
    assert.throws(() => GraphQLDateTime.parseValue(''), GraphQLError)
    assert.deepEqual(new Date(0), GraphQLDateTime.parseValue(0))
    assert.deepEqual(now, GraphQLDateTime.parseValue(now))

    assert.throws(() => GraphQLDateTime.parseLiteral({
      kind: 'StringValue',
      value: '',
    }), GraphQLError)
    assert.deepEqual(new Date(0), GraphQLDateTime.parseLiteral({
      kind: 'IntValue',
      value: '0',
    }))
  })
})
