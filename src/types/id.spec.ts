import 'reflect-metadata'
import 'mocha'
import * as assert from 'assert'

import { GraphQLString, GraphQLScalarType, StringValueNode, IntValueNode } from 'graphql'
import { ID, toGlobalId } from './id'
import { ObjectType } from '../decorators/objectType'
import { Field } from '../decorators/field'

describe('Test @ID decorator', () => {
  it('Should resolve to TypeResolver correctly', () => {
    @ObjectType()
    class Dummy {
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
    const invalidTypeStringValueNode: StringValueNode = {
      kind: 'StringValue',
      value: toGlobalId('Invalid', '1'),
    }
    const intValueNode: IntValueNode = {
      kind: 'IntValue',
      value: dummyId,
    }
    assert.equal(idType.parseLiteral(stringValueNode), '1')
    assert.throws(() => idType.parseLiteral(invalidStringValueNode))
    assert.throws(() => idType.parseLiteral(invalidTypeStringValueNode))
    assert.throws(() => idType.parseLiteral(intValueNode))
  })

  it('Should resolve to same instance using ObjectType/Thunk<ObjectType> multiple times', () => {
    @ObjectType()
    class Dummy {
      @Field() id: string
    }

    const type0 = ID(Dummy).resolveToOutputType()
    const type1 = ID(Dummy).resolveToOutputType()
    const type2 = ID(() => Dummy).resolveToOutputType()
    const type3 = ID(() => Dummy).resolveToOutputType()
    assert.equal(type0, type1)
    assert.equal(type2, type3)
    assert.equal(type0, type2)
  })

  it('Should throws if resolve with non object type', () => {
    const resolver = ID(GraphQLString)
    assert.throws(() => resolver.resolveToInputType())
    assert.throws(() => resolver.resolveToOutputType())
  })

  it('Should throws if serialize/parse with invalid value', () => {
    @ObjectType()
    class Dummy {
      @Field() id: string
    }

    const resolver = ID(Dummy)
    const idType = resolver.resolveToOutputType() as GraphQLScalarType
    assert.throws(() => idType.serialize(1))
    assert.throws(() => idType.parseValue(1))
  })
})
