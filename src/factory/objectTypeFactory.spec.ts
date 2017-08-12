import 'mocha'
import * as assert from 'assert'
import { GraphQLString } from 'graphql'

import { ObjectType } from '../objectType'
import { Field } from '../decorators/field'
import { objectTypeFactory, inputObjectTypeFactory } from './objectTypeFactory'

describe('Test objectTypeFactory/inputObjectTypeFactory', () => {
  it('Should generate GraphQLObjectType with simple fields correctly', () => {
    class User extends ObjectType {
      @Field() id: string
    }

    const objectType = objectTypeFactory(User)
    assert.equal(objectType.name, 'User')
    assert.deepEqual(objectType.getFields(), {
      id: {
        name: 'id',
        type: GraphQLString,
        description: undefined,
        args: [],
        deprecationReason: undefined,
        isDeprecated: false,
        resolve: undefined,
      },
    })
  })

  it('Should generate GraphQLInputObjectType with simple fields correctly', () => {
    class User extends ObjectType {
      @Field() id: string
    }

    const inputObjectType = inputObjectTypeFactory(User)
    assert.equal(inputObjectType.name, 'UserInput')
    assert.deepEqual(inputObjectType.getFields(), {
      id: {
        name: 'id',
        type: GraphQLString,
        description: undefined,
        defaultValue: undefined,
      },
    })
  })

  it('Should generate same GraphQLInputObjectType everytime', () => {
    class User extends ObjectType {
      @Field() id: string
    }
    const objectType1 = objectTypeFactory(User)
    const objectType2 = objectTypeFactory(User)
    assert.equal(objectType1, objectType2)
    const inputObjectType1 = inputObjectTypeFactory(User)
    const inputObjectType2 = inputObjectTypeFactory(User)
    assert.equal(inputObjectType1, inputObjectType2)
  })
})
