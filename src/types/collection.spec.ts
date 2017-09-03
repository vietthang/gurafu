import 'reflect-metadata'
import 'mocha'
import * as assert from 'assert'

import { GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLInt } from 'graphql'
import { ObjectType } from '../decorators/objectType'
import { Field } from '../decorators/field'
import { Type } from '../decorators/type'
import { Collection } from './collection'
import { objectTypeFactory } from '../factory/objectTypeFactory'

describe('Test @Collection decorator', () => {
  it('Should throws to resolve non object type', () => {
    const resolver = Collection(GraphQLInt)
    assert.throws(() => resolver.resolveToOutputType())
  })

  it('Should resolve to TypeResolver correctly', () => {
    @ObjectType()
    class Dummy {
      @Field() @Type(String) id: string
    }

    const expectedObjectType = new GraphQLObjectType({
      name: 'DummyCollection',
      fields: {
        paging: {
          type: new GraphQLObjectType({
            name: 'Paging',
            fields: {
              limit: { type: GraphQLInt },
              offset: { type: GraphQLInt },
              total: { type: GraphQLInt },
            },
          }),
        },
        items: {
          type: new GraphQLList(new GraphQLNonNull(objectTypeFactory(Dummy))),
        },
      },
    })

    const resolver = Collection(Dummy)
    assert.throws(() => resolver.resolveToInputType())
    assert.deepEqual(expectedObjectType, resolver.resolveToOutputType())
  })
})
