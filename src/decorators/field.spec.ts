import 'mocha'
import * as assert from 'assert'
import { GraphQLString, GraphQLFloat, GraphQLInt, GraphQLBoolean } from 'graphql'
import * as GraphQLDate from 'graphql-date'

import { Field, getFieldConfigMap, Arg, Context } from './field'

describe('Test Field decorator', () => {
  it('Should add correct metadata with simple field', () => {
    class O {
      @Field()
      id: string
    }
    const fieldConfigMap = getFieldConfigMap(O)
    assert.deepStrictEqual(fieldConfigMap, {
      id: {
        type: GraphQLString,
        args: undefined,
        resolve: undefined,
      },
    })
  })

  it('Should resolve all native types fine', () => {
    class O {
      @Field()
      someString: string

      @Field()
      someNumber: number

      @Field()
      someBoolean: boolean

      @Field()
      someDate: Date
    }
    const fieldConfigMap = getFieldConfigMap(O)
    assert.deepStrictEqual(fieldConfigMap, {
      someString: {
        type: GraphQLString,
        args: undefined,
        resolve: undefined,
      },
      someNumber: {
        type: GraphQLFloat,
        args: undefined,
        resolve: undefined,
      },
      someBoolean: {
        type: GraphQLBoolean,
        args: undefined,
        resolve: undefined,
      },
      someDate: {
        type: GraphQLDate,
        args: undefined,
        resolve: undefined,
      },
    })
  })

  it('Should fails when resolve complex type', () => {
    assert.throws(() => {
      class Dummy {
        @Field()
        someComplexType: string | number
      }
      getFieldConfigMap(Dummy)
    })
  })

  it('Should add correct metadata with many fields', () => {
    class O {
      @Field()
      id: string

      @Field()
      someNumber: number
    }
    const fieldConfigMap = getFieldConfigMap(O)
    assert.deepStrictEqual(fieldConfigMap, {
      id: {
        type: GraphQLString,
        args: undefined,
        resolve: undefined,
      },
      someNumber: {
        type: GraphQLFloat,
        args: undefined,
        resolve: undefined,
      },
    })
  })

  it('Should add correct metadata with custom field type', () => {
    class O {
      @Field()
      id: string

      @Field(GraphQLInt)
      someNumber: number
    }
    const fieldConfigMap = getFieldConfigMap(O)
    assert.deepStrictEqual(fieldConfigMap, {
      id: {
        type: GraphQLString,
        args: undefined,
        resolve: undefined,
      },
      someNumber: {
        type: GraphQLInt,
        args: undefined,
        resolve: undefined,
      },
    })
  })

  it('Should add correct metadata with simple function field', () => {
    class O {
      firstName: string
      lastName: string

      @Field()
      fullName(): string {
        return this.firstName + ' ' + this.lastName
      }
    }
    const fieldConfigMap = getFieldConfigMap(O)
    const fullNameField = fieldConfigMap!.fullName
    assert.equal(fullNameField.type, GraphQLString)
    assert.equal(typeof fullNameField.resolve, 'function')
    const o = new O()
    o.firstName = 'David'
    o.lastName = 'Beckham'
    assert.equal(fullNameField.resolve!(o, {}, undefined, null as any), 'David Beckham')
    assert.deepEqual(fullNameField.args, {})
  })

  it('Should add correct metadata to function with arg', () => {
    class O {
      firstName: string
      lastName: string

      @Field()
      fullName(
        @Arg({ name: 'reverse' }) reverse: boolean,
      ): string {
        if (reverse) {
          return this.lastName + ' ' + this.firstName
        } else {
          return this.firstName + ' ' + this.lastName
        }
      }
    }

    const fieldConfigMap = getFieldConfigMap(O)
    const fullNameField = fieldConfigMap!.fullName
    assert.equal(fullNameField.type, GraphQLString)
    assert.equal(typeof fullNameField.resolve, 'function')
    const o = new O()
    o.firstName = 'David'
    o.lastName = 'Beckham'
    assert.equal(fullNameField.resolve!(o, { reverse: true }, undefined, null as any), 'Beckham David')
    assert.equal(fullNameField.resolve!(o, { reverse: false }, undefined, null as any), 'David Beckham')
    assert.deepEqual(fullNameField.args, {
      reverse: {
        type: GraphQLBoolean,
        defaultValue: undefined,
        description: undefined,
      },
    })
  })

  it('Should add correct metadata to function with arg and context', () => {
    const context = {
      title: 'Mr',
    }

    class O {

      firstName: string

      lastName: string

      @Field()
      fullName(
        @Context() context: any,
        @Arg({ name: 'reverse' }) reverse: boolean,
      ): string {
        if (reverse) {
          return context.title + '. ' + this.lastName + ' ' + this.firstName
        } else {
          return context.title + '. ' + this.firstName + ' ' + this.lastName
        }
      }
    }

    const fieldConfigMap = getFieldConfigMap(O)
    const fullNameField = fieldConfigMap!.fullName
    assert.equal(fullNameField.type, GraphQLString)
    assert.equal(typeof fullNameField.resolve, 'function')
    const o = new O()
    o.firstName = 'David'
    o.lastName = 'Beckham'
    assert.equal(fullNameField.resolve!(o, { reverse: true }, context, null as any), 'Mr. Beckham David')
    assert.equal(fullNameField.resolve!(o, { reverse: false }, context, null as any), 'Mr. David Beckham')
    assert.deepEqual(fullNameField.args, {
      reverse: {
        type: GraphQLBoolean,
        defaultValue: undefined,
        description: undefined,
      },
    })
  })
})
