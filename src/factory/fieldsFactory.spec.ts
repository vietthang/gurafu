import 'mocha'
import * as assert from 'assert'
import { GraphQLString, GraphQLFloat } from 'graphql'

import { ObjectType } from '../decorators/objectType'
import { Field } from '../decorators/field'
import { Arg, Context, Info } from '../decorators/arg'
import { Description } from '../decorators/description'
import { Deprecated } from '../decorators/deprecated'
import { fieldsFactory, inputFieldsFactory } from './fieldsFactory'

describe('Test fieldsFactory/inputFieldsFactory', () => {
  it('Should generate GraphQLFieldConfigMap with simple fields correctly', () => {
    @ObjectType() class User {
      @Field() id: string

      @Field('first_name')
      @Description('User first name')
      firstName: string

      @Field('last_name')
      @Deprecated('Use first name')
      lastName: string
    }

    const fieldConfigMap = fieldsFactory(User)
    assert.deepEqual(fieldConfigMap, {
      id: {
        type: GraphQLString,
        description: undefined,
        deprecationReason: undefined,
        args: undefined,
        resolve: undefined,
      },
      first_name: {
        type: GraphQLString,
        description: 'User first name',
        deprecationReason: undefined,
        args: undefined,
        resolve: undefined,
      },
      last_name: {
        type: GraphQLString,
        description: undefined,
        deprecationReason: 'Use first name',
        args: undefined,
        resolve: undefined,
      },
    })
  })

  it('Should generate GraphQLFieldConfigMap with function field correctly', () => {
    @ObjectType() class Dummy {
      @Field() plusOne(
        @Arg('value') value: number,
      ): number {
        return 1 + value
      }
    }
    const fieldConfigMap = fieldsFactory(Dummy)
    assert.deepEqual(fieldConfigMap.plusOne.type, GraphQLFloat)
    assert.deepEqual(fieldConfigMap.plusOne.description, undefined)
    assert.deepEqual(fieldConfigMap.plusOne.deprecationReason, undefined)
    assert.deepEqual(fieldConfigMap.plusOne.args, {
      value: {
        type: GraphQLFloat,
        defaultValue: undefined,
        description: undefined,
      },
    })
    const dummy = new Dummy()
    assert.equal(
      fieldConfigMap.plusOne.resolve!(dummy, { value: 1 }, null, null as any),
      2,
    )
  })

  it('Should generate GraphQLFieldConfigMap with @Context correctly', () => {
    @ObjectType() class Dummy {
      @Field() returnContext(
        @Context() context: number,
      ): number {
        return context
      }
    }
    const fieldConfigMap = fieldsFactory(Dummy)
    assert.deepEqual(fieldConfigMap.returnContext.type, GraphQLFloat)
    assert.deepEqual(fieldConfigMap.returnContext.description, undefined)
    assert.deepEqual(fieldConfigMap.returnContext.deprecationReason, undefined)
    assert.deepEqual(fieldConfigMap.returnContext.args, {})
    const dummy = new Dummy()
    assert.equal(
      fieldConfigMap.returnContext.resolve!(dummy, { }, 1, null as any),
      1,
    )
  })

  it('Should generate GraphQLFieldConfigMap with @Info correctly', () => {
    @ObjectType() class Dummy {
      @Field() returnInfo(
        @Info() info: number,
      ): number {
        return info
      }
    }
    const fieldConfigMap = fieldsFactory(Dummy)
    assert.deepEqual(fieldConfigMap.returnInfo.type, GraphQLFloat)
    assert.deepEqual(fieldConfigMap.returnInfo.description, undefined)
    assert.deepEqual(fieldConfigMap.returnInfo.deprecationReason, undefined)
    assert.deepEqual(fieldConfigMap.returnInfo.args, {})
    const dummy = new Dummy()
    assert.equal(
      fieldConfigMap.returnInfo.resolve!(dummy, { }, null, 1 as any),
      1,
    )
  })

  it('Should failed if not all parameter are mapped', () => {
    @ObjectType() class Dummy {
      @Field() plusOne(
        value: number,
      ): number {
        return value
      }
    }
    const fieldConfigMap = fieldsFactory(Dummy)
    assert.throws(() => {
      fieldConfigMap.plusOne.resolve!(null, { value: 1 }, null, null as any)
    })
  })

  it('Should failed to generate ObjectType/InputObjectType for class without any field decorator', () => {
    class Dummy {
      id: string
    }
    assert.throws(() => fieldsFactory(Dummy))
    assert.throws(() => inputFieldsFactory(Dummy))
  })
})