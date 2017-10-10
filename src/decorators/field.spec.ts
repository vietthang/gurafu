import 'reflect-metadata'
import 'mocha'
import * as assert from 'assert'
import { GraphQLString } from 'graphql'

import { Field, getFieldNameMap } from './field'
import { getType } from './type'

describe('Test @Field decorator', () => {
  it('Should add correct metadata to property', () => {
    class Dummy {
      @Field()
      id: string

      @Field('custom')
      name: string

      nonDecorated: string
    }
    assert.deepStrictEqual(getFieldNameMap(Dummy), {
      id: 'id',
      name: 'custom',
    })
  })

  it('Should add correct metadata with type only', () => {
    class Dummy {
      @Field(GraphQLString)
      id: string
    }
    assert.deepStrictEqual(getFieldNameMap(Dummy), { id: 'id' })
    assert.equal(getType(Dummy, 'id'), GraphQLString)
  })

  it('Should add correct metadata with both type and name', () => {
    class Dummy {
      @Field('custom', GraphQLString)
      id: string
    }
    assert.deepStrictEqual(getFieldNameMap(Dummy), { id: 'custom' })
    assert.equal(getType(Dummy, 'id'), GraphQLString)
  })

  it('Should get undefined deprication reason if property have not decorated with @Deprecated', () => {
    class Dummy {
      id: string
    }
    assert.equal(getFieldNameMap(Dummy), undefined)
  })
})
