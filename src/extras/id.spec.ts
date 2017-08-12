import 'mocha'
import * as assert from 'assert'

import { GraphQLScalarType, StringValueNode, IntValueNode } from 'graphql'
import { toGlobalId } from 'graphql-relay'
import { ID } from './id'
import { ObjectType } from '../objectType'
import { Field } from '../decorators/field'

describe('Test @ID decorator', () => {
  it('Should resolve to TypeResolver correctly', () => {
    class Dummy extends ObjectType {
      @Field() id: string
    }
    const DummyIdTypeResolver = ID(Dummy)
    const DummyIdType = DummyIdTypeResolver.resolveToOutputType()
    const DummyIdInputType = DummyIdTypeResolver.resolveToInputType()
    assert.deepEqual(DummyIdType, DummyIdInputType)
    assert(DummyIdType instanceof GraphQLScalarType)
    const idType = DummyIdType as GraphQLScalarType
    const dummyId = toGlobalId('Dummy', '1')
    assert.equal(idType.serialize('1'), dummyId)
    assert.equal(idType.parseValue(dummyId), '1')
    const nonUserId = toGlobalId('NonDummy', '1')
    assert.throws(() => idType.parseValue(nonUserId))

    const stringValueNode: StringValueNode = {
      kind: 'StringValue',
      value: dummyId,
    }
    const invalidStringValueNode: StringValueNode = {
      kind: 'StringValue',
      value: 'Invalid',
    }
    const intValueNode: IntValueNode = {
      kind: 'IntValue',
      value: dummyId,
    }
    assert.equal(idType.parseLiteral(stringValueNode), '1')
    assert.throws(() => idType.parseLiteral(invalidStringValueNode))
    assert.throws(() => idType.parseLiteral(intValueNode))
  })
})
