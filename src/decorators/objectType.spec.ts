import 'mocha'
import * as assert from 'assert'
import { GraphQLString, GraphQLObjectType, GraphQLBoolean, GraphQLInputObjectType, GraphQLInt, GraphQLFloat } from 'graphql'

import { ObjectType, getObjectTypeConfig, resolveToObjectType, resolveToInputObjectType } from './objectType'
import { Field, Arg } from './field'

describe('Test ObjectType decorator', () => {
  it('Should fails if decorated class with no field', () => {
    assert.throws(() => {
      @ObjectType() class Dummy {}
      getObjectTypeConfig(Dummy)
    })
  })

  it('Should create ObjectType with field', () => {
    @ObjectType() class Dummy {
      @Field()
      id: string
    }
    const graphQLObjectType = getObjectTypeConfig(Dummy)
    assert.deepStrictEqual(graphQLObjectType, {
      name: 'Dummy',
      fields: {
        id: {
          type: GraphQLString,
          args: undefined,
          resolve: undefined,
        },
      },
    })
  })

  it('Should resolve simple ObjectType correctly', () => {
    @ObjectType() class User {
      @Field()
      id: string

      @Field()
      email: string

      @Field()
      active: boolean
    }

    const graphQLObjectType = resolveToObjectType(User)
    assert.deepEqual(
      graphQLObjectType,
      new GraphQLObjectType({
        name: 'User',
        description: undefined,
        fields: {
          id: {
            type: GraphQLString,
            description: undefined,
            args: undefined,
            resolve: undefined,
          },
          email: {
            type: GraphQLString,
            description: undefined,
            args: undefined,
            resolve: undefined,
          },
          active: {
            type: GraphQLBoolean,
            description: undefined,
            args: undefined,
            resolve: undefined,
          },
        },
      }),
    )
  })

  it('Should resolve ObjectType with method & arguments correctly', () => {
    const entries = [ 0, 1, 2, 3, 4 ]
    @ObjectType() class Dummy {
      @Field()
      children(
        @Arg({ name: 'index', type: GraphQLInt }) index: number,
      ): number {
        return entries[index]
      }
    }

    const graphQLObjectType = resolveToObjectType(Dummy)
    const d = new Dummy()
    const childrenField = graphQLObjectType.getFields().children
    assert.deepEqual(childrenField.type, GraphQLFloat)
    assert.deepEqual(childrenField.args, [
      {
        name: 'index',
        type: GraphQLFloat,
        defaultValue: undefined,
        description: null,
        astNode: undefined,
      },
    ])
    assert.equal(childrenField.resolve!(d, { index: 0 }, null, null as any), 0)
    assert.equal(childrenField.resolve!(d, { index: 1 }, null, null as any), 1)
    assert.equal(childrenField.resolve!(d, { index: 2 }, null, null as any), 2)
  })

  it('Should resolve with nested ObjectType correctly', () => {
    @ObjectType() class Embeded {
      @Field() id: string
    }
    @ObjectType() class Dummy {
      @Field()
      embeded: Embeded
    }

    const graphQLObjectType = resolveToObjectType(Dummy)
    assert.deepEqual(
      graphQLObjectType,
      new GraphQLObjectType({
        name: 'Dummy',
        description: undefined,
        fields: {
          embeded: {
            type: new GraphQLObjectType({
              name: 'Embeded',
              description: undefined,
              fields: {
                id: {
                  type: GraphQLString,
                  description: undefined,
                  args: undefined,
                  resolve: undefined,
                },
              },
            }),
            description: undefined,
            args: undefined,
            resolve: undefined,
          },
        },
      }),
    )
  })

  it('Should fails when resolve ObjectType without any field', () => {
    assert.throws(() => { resolveToObjectType(class Dummy {}) })
  })

  it('Should fails when resolve function to ObjectType without @ObjectType decorator', () => {
    assert.throws(() => {
      class Dummy {
        @Field()
        id: string
      }
      resolveToObjectType(Dummy)
    })
  })

  it('Should resolve InputObjectType correctly', () => {
    @ObjectType()
    class Dummy {
      @Field()
      id: string
    }
    const inputObjectType = resolveToInputObjectType(Dummy)
    assert.deepEqual(inputObjectType, new GraphQLInputObjectType({
      name: 'InputDummy',
      description: undefined,
      fields: {
        id: {
          type: GraphQLString,
          defaultValue: undefined,
          description: undefined,
        },
      },
    }))
  })
})
