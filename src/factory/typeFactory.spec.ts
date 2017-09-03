import 'reflect-metadata'
import 'mocha'
import * as assert from 'assert'
import {
  GraphQLString,
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLEnumType,
  GraphQLUnionType,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
} from 'graphql'

import { ObjectType } from '../decorators/objectType'
import { Field } from '../decorators/field'
import { Type } from '../decorators/type'
import { getTypeResolver } from './typeFactory'

describe('Test typeFactory', () => {
  it('Should get type resolver from native javascript types correctly', () => {
    const stringResolver = getTypeResolver(String)
    assert.deepStrictEqual(stringResolver.resolveToInputType(), GraphQLString)
    assert.deepStrictEqual(stringResolver.resolveToOutputType(), GraphQLString)

    const floatResolver = getTypeResolver(Number)
    assert.deepStrictEqual(floatResolver.resolveToInputType(), GraphQLFloat)
    assert.deepStrictEqual(floatResolver.resolveToOutputType(), GraphQLFloat)

    const booleanResolver = getTypeResolver(Boolean)
    assert.deepStrictEqual(booleanResolver.resolveToInputType(), GraphQLBoolean)
    assert.deepStrictEqual(booleanResolver.resolveToOutputType(), GraphQLBoolean)
  })

  it('Should throws when try to get type resolver from invalid value', () => {
    assert.throws(() => getTypeResolver({} as any))
  })

  it('Should get type resolver from native GraphQL scalar type correctly', () => {
    const resolver = getTypeResolver(GraphQLString)
    assert.deepStrictEqual(resolver.resolveToInputType(), GraphQLString)
    assert.deepStrictEqual(resolver.resolveToOutputType(), GraphQLString)
  })

  it('Should get type resolver from native GraphQL enum type correctly', () => {
    const enumType = new GraphQLEnumType({
      name: 'MyEnum',
      values: {
        active: {
          value: 1,
        },
        inactive: {
          value: 0,
        },
      },
    })
    const resolver = getTypeResolver(enumType)
    assert.deepStrictEqual(resolver.resolveToInputType(), enumType)
    assert.deepStrictEqual(resolver.resolveToOutputType(), enumType)
  })

  it('Should get type resolver from native GraphQL union type correctly', () => {
    const object1Type = new GraphQLObjectType({
      name: 'Object1',
      fields: {
        id1: {
          type: GraphQLString,
        },
      },
    })
    const object2Type = new GraphQLObjectType({
      name: 'Object2',
      fields: {
        id2: {
          type: GraphQLString,
        },
      },
    })
    const unionType = new GraphQLUnionType({
      name: 'MyUnion',
      types: [object1Type, object2Type],
    })

    const resolver = getTypeResolver(unionType)
    assert.throws(() => resolver.resolveToInputType())
    assert.deepStrictEqual(resolver.resolveToOutputType(), unionType)
  })

  it('Should get type resolver from native GraphQL interface type correctly', () => {
    const interfaceType = new GraphQLInterfaceType({
      name: 'Interface',
      fields: {
        id1: {
          type: GraphQLString,
        },
      },
    })

    const resolver = getTypeResolver(interfaceType)
    assert.throws(() => resolver.resolveToInputType())
    assert.deepStrictEqual(resolver.resolveToOutputType(), interfaceType)
  })

  it('Should get type resolver from native GraphQL object type correctly', () => {
    const objectType = new GraphQLObjectType({
      name: 'Object',
      fields: {
        id: {
          type: GraphQLString,
        },
      },
    })

    const resolver = getTypeResolver(objectType)
    assert.throws(() => resolver.resolveToInputType())
    assert.deepStrictEqual(resolver.resolveToOutputType(), objectType)
  })

  it('Should get type resolver from native GraphQL input object type correctly', () => {
    const inputObjectType = new GraphQLInputObjectType({
      name: 'Object',
      fields: {
        id: {
          type: GraphQLString,
        },
      },
    })

    const resolver = getTypeResolver(inputObjectType)
    assert.deepStrictEqual(resolver.resolveToInputType(), inputObjectType)
    assert.throws(() => resolver.resolveToOutputType())
  })

  it('Should get type resolver from thunk correctly', () => {
    const resolver = getTypeResolver(() => GraphQLString)
    assert.deepStrictEqual(resolver.resolveToInputType(), GraphQLString)
    assert.deepStrictEqual(resolver.resolveToOutputType(), GraphQLString)
  })

  it('Should get type resolver from native GraphQLNonNull correctly', () => {
    const resolver = getTypeResolver(new GraphQLNonNull(GraphQLString))
    assert.deepStrictEqual(resolver.resolveToInputType(), new GraphQLNonNull(GraphQLString))
    assert.deepStrictEqual(resolver.resolveToOutputType(), new GraphQLNonNull(GraphQLString))
  })

  it('Should get type resolver from native GraphQLList correctly', () => {
    const resolver = getTypeResolver(new GraphQLList(GraphQLString))
    assert.deepStrictEqual(resolver.resolveToInputType(), new GraphQLList(GraphQLString))
    assert.deepStrictEqual(resolver.resolveToOutputType(), new GraphQLList(GraphQLString))
  })

  it('Should get type resolver from @ObjectType decorated class correctly', () => {
    @ObjectType()
    class A {
      @Field() @Type(String) id: string
    }

    const resolver = getTypeResolver(A)
    const dummyInputObjectType = resolver.resolveToInputType() as GraphQLInputObjectType
    assert.equal(dummyInputObjectType.name, 'AInput')
    assert.equal(dummyInputObjectType.description, undefined)
    assert.deepEqual(dummyInputObjectType.getFields(), {
      id: {
        name: 'id',
        type: GraphQLString,
        description: undefined,
        defaultValue: undefined,
      },
    })

    const dummyObjectType = resolver.resolveToOutputType() as GraphQLObjectType
    assert.equal(dummyObjectType.name, 'A')
    assert.equal(dummyObjectType.description, undefined)
    assert.deepEqual(dummyObjectType.getFields(), {
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

  // it('Should decorate using @List correctly', () => {
  //   class Dummy {
  //     @List(GraphQLString)
  //     ids: string[]
  //   }

  //   const resolver = getType(Dummy, 'ids')!
  //   assert.deepStrictEqual(resolver.resolveToInputType(), new GraphQLList(GraphQLString))
  //   assert.deepStrictEqual(resolver.resolveToOutputType(), new GraphQLList(GraphQLString))
  // })

  // it('Should decorate using @NonNull correctly', () => {
  //   class Dummy {
  //     @NonNull(GraphQLString)
  //     ids: string[]
  //   }

  //   const resolver = getType(Dummy, 'ids')!
  //   assert.deepStrictEqual(resolver.resolveToInputType(), new GraphQLNonNull(GraphQLString))
  //   assert.deepStrictEqual(resolver.resolveToOutputType(), new GraphQLNonNull(GraphQLString))
  // })

  // it('Should decorate using chaining @List/@NonNull correctly', () => {
  //   class Dummy {
  //     @NonNull(List(GraphQLString))
  //     nonNullList: string[]

  //     @List(NonNull(GraphQLString))
  //     listNonNull: string[]

  //     @NonNull(List(NonNull(GraphQLString)))
  //     nonNullListNonNull: string[]
  //   }

  //   const nonNullListResolver = getType(Dummy, 'nonNullList')!
  //   assert.deepStrictEqual(nonNullListResolver.resolveToInputType(), new GraphQLNonNull(new GraphQLList(GraphQLString)))
  //   assert.deepStrictEqual(nonNullListResolver.resolveToOutputType(), new GraphQLNonNull(new GraphQLList(GraphQLString)))

  //   const listNonNullResolver = getType(Dummy, 'listNonNull')!
  //   assert.deepStrictEqual(listNonNullResolver.resolveToInputType(), new GraphQLList(new GraphQLNonNull(GraphQLString)))
  //   assert.deepStrictEqual(listNonNullResolver.resolveToOutputType(), new GraphQLList(new GraphQLNonNull(GraphQLString)))

  //   const nonNullListNonNullResolver = getType(Dummy, 'nonNullListNonNull')!
  //   assert.deepStrictEqual(
  //     nonNullListNonNullResolver.resolveToInputType(),
  //     new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))),
  //   )
  //   assert.deepStrictEqual(
  //     nonNullListNonNullResolver.resolveToOutputType(),
  //     new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))),
  //   )
  // })

  // it('Should decorate function parameter correctly', () => {
  //   class Dummy {
  //     doSomething(
  //       @Type(GraphQLString) arg: string,
  //     ) {
  //       return arg
  //     }
  //   }
  //   const doSomethingResolver = getType(Dummy, 'doSomething', 0)!
  //   assert.deepStrictEqual(doSomethingResolver.resolveToInputType(), GraphQLString)
  //   assert.deepStrictEqual(doSomethingResolver.resolveToOutputType(), GraphQLString)
  // })

  // it('Should decorate function return type correctly', () => {
  //   class Dummy {
  //     @Type(GraphQLInt) doSomething() {
  //       return 1
  //     }
  //   }
  //   const doSomethingResolver = getType(Dummy, 'doSomething')!
  //   assert.deepStrictEqual(doSomethingResolver.resolveToInputType(), GraphQLInt)
  //   assert.deepStrictEqual(doSomethingResolver.resolveToOutputType(), GraphQLInt)
  // })
})
