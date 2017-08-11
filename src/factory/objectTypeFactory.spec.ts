import 'mocha'
import * as assert from 'assert'
import { GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'

import { ObjectType } from '../decorators/objectType'
import { Field } from '../decorators/field'
import { objectTypeFactory, inputObjectTypeFactory } from './objectTypeFactory'

describe('Test objectTypeFactory/inputObjectTypeFactory', () => {
  it('Should generate GraphQLObjectType with simple fields correctly', () => {
    @ObjectType() class User {
      @Field() id: string
    }

    const objectType = objectTypeFactory(User)
    assert.deepEqual(objectType, new GraphQLObjectType({
      name: 'User',
      description: undefined,
      fields: {
        id: {
          type: GraphQLString,
          description: undefined,
          deprecationReason: undefined,
          args: undefined,
          resolve: undefined,
        }
      }
    }))
  })

  it('Should generate GraphQLInputObjectType with simple fields correctly', () => {
    @ObjectType() class User {
      @Field() id: string
    }

    const inputObjectType = inputObjectTypeFactory(User)
    assert.deepEqual(inputObjectType, new GraphQLInputObjectType({
      name: 'UserInput',
      description: undefined,
      fields: {
        id: {
          type: GraphQLString,
          description: undefined,
          defaultValue: undefined,
        }
      }
    }))
  })

  it('Should generate same GraphQLInputObjectType everytime', () => {
    @ObjectType() class User {
      @Field() id: string
    }
    const objectType1 = objectTypeFactory(User)
    const objectType2 = objectTypeFactory(User)
    assert.equal(objectType1, objectType2)
    const inputObjectType1 = inputObjectTypeFactory(User)
    const inputObjectType2 = inputObjectTypeFactory(User)
    assert.equal(inputObjectType1, inputObjectType2)
  })

  it('Should fail if try to generate from non @ObjectType class', () => {
    class User {
      @Field() id: string
    }
    assert.throws(() => objectTypeFactory(User))
    assert.throws(() => inputObjectTypeFactory(User))
  })
})