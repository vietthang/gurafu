import 'mocha'
import * as assert from 'assert'
import {
  GraphQLString,
  GraphQLInt,
  GraphQLEnumType,
  GraphQLUnionType,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
} from 'graphql'

import { ObjectType } from './objectType'
import { Field } from './field'
import { Type, getTypeResolver, List, NonNull } from './type'

describe('Test @Type/@List/@NonNull decorators', () => {
  it('Should decorate using other type resolver correctly', () => {
    const typeResolver = {
      resolveToInputType() {
        return GraphQLString
      },
      resolveToOutputType() {
        return GraphQLInt
      },
    }
    class Dummy {
      @Type(typeResolver) id: string
    }

    const resolver = getTypeResolver(Dummy, 'id')!
    assert.deepStrictEqual(resolver.resolveToInputType(), GraphQLString)
    assert.deepStrictEqual(resolver.resolveToOutputType(), GraphQLInt)
  })

  it('Should decorate using scalar type correctly', () => {
    class Dummy {
      @Type(GraphQLString) id: string
    }

    const resolver = getTypeResolver(Dummy, 'id')!
    assert.deepStrictEqual(resolver.resolveToInputType(), GraphQLString)
    assert.deepStrictEqual(resolver.resolveToOutputType(), GraphQLString)
  })

  it('Should decorate using enum type correctly', () => {
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
    class Dummy {
      @Type(enumType) id: string
    }

    const resolver = getTypeResolver(Dummy, 'id')!
    assert.deepStrictEqual(resolver.resolveToInputType(), enumType)
    assert.deepStrictEqual(resolver.resolveToOutputType(), enumType)
  })

  it('Should decorate using union type correctly', () => {
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
    class Dummy {
      @Type(unionType) id: string
    }

    const resolver = getTypeResolver(Dummy, 'id')!
    assert.throws(() => resolver.resolveToInputType())
    assert.deepStrictEqual(resolver.resolveToOutputType(), unionType)
  })

  it('Should decorate using ObjectType type correctly', () => {
    const objectType = new GraphQLObjectType({
      name: 'Object',
      fields: {
        id: {
          type: GraphQLString,
        },
      },
    })
    class Dummy {
      @Type(objectType) id: string
    }

    const resolver = getTypeResolver(Dummy, 'id')!
    assert.throws(() => resolver.resolveToInputType())
    assert.deepStrictEqual(resolver.resolveToOutputType(), objectType)
  })

  it('Should decorate using InputObjectType type correctly', () => {
    const objectType = new GraphQLInputObjectType({
      name: 'Object',
      fields: {
        id: {
          type: GraphQLString,
        },
      },
    })
    class Dummy {
      @Type(objectType) id: string
    }

    const resolver = getTypeResolver(Dummy, 'id')!
    assert.deepStrictEqual(resolver.resolveToInputType(), objectType)
    assert.throws(() => resolver.resolveToOutputType())
  })

  it('Should decorate using GraphQLNonNull type correctly', () => {
    class Dummy {
      @Type(new GraphQLNonNull(GraphQLString)) id: string
    }

    const resolver = getTypeResolver(Dummy, 'id')!
    assert.deepStrictEqual(resolver.resolveToInputType(), new GraphQLNonNull(GraphQLString))
    assert.deepStrictEqual(resolver.resolveToOutputType(), new GraphQLNonNull(GraphQLString))
  })

  it('Should decorate using GraphQLList type correctly', () => {
    class Dummy {
      @Type(new GraphQLList(GraphQLString)) id: string
    }

    const resolver = getTypeResolver(Dummy, 'id')!
    assert.deepStrictEqual(resolver.resolveToInputType(), new GraphQLList(GraphQLString))
    assert.deepStrictEqual(resolver.resolveToOutputType(), new GraphQLList(GraphQLString))
  })

  it('Should decorate using @ObjectType class correctly', () => {
    @ObjectType() class A {
      @Field() id: string
    }
    class Dummy {
      @Type(A) id: string
    }

    const resolver = getTypeResolver(Dummy, 'id')!
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

  it('Should decorate using @List correctly', () => {
    class Dummy {
      @List(GraphQLString)
      ids: string[]
    }

    const resolver = getTypeResolver(Dummy, 'ids')!
    assert.deepStrictEqual(resolver.resolveToInputType(), new GraphQLList(GraphQLString))
    assert.deepStrictEqual(resolver.resolveToOutputType(), new GraphQLList(GraphQLString))
  })

  it('Should decorate using @NonNull correctly', () => {
    class Dummy {
      @NonNull(GraphQLString)
      ids: string[]
    }

    const resolver = getTypeResolver(Dummy, 'ids')!
    assert.deepStrictEqual(resolver.resolveToInputType(), new GraphQLNonNull(GraphQLString))
    assert.deepStrictEqual(resolver.resolveToOutputType(), new GraphQLNonNull(GraphQLString))
  })

  it('Should decorate using chaining @List/@NonNull correctly', () => {
    class Dummy {
      @NonNull(List(GraphQLString))
      nonNullList: string[]

      @List(NonNull(GraphQLString))
      listNonNull: string[]

      @NonNull(List(NonNull(GraphQLString)))
      nonNullListNonNull: string[]
    }

    const nonNullListResolver = getTypeResolver(Dummy, 'nonNullList')!
    assert.deepStrictEqual(nonNullListResolver.resolveToInputType(), new GraphQLNonNull(new GraphQLList(GraphQLString)))
    assert.deepStrictEqual(nonNullListResolver.resolveToOutputType(), new GraphQLNonNull(new GraphQLList(GraphQLString)))

    const listNonNullResolver = getTypeResolver(Dummy, 'listNonNull')!
    assert.deepStrictEqual(listNonNullResolver.resolveToInputType(), new GraphQLList(new GraphQLNonNull(GraphQLString)))
    assert.deepStrictEqual(listNonNullResolver.resolveToOutputType(), new GraphQLList(new GraphQLNonNull(GraphQLString)))

    const nonNullListNonNullResolver = getTypeResolver(Dummy, 'nonNullListNonNull')!
    assert.deepStrictEqual(
      nonNullListNonNullResolver.resolveToInputType(),
      new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))),
    )
    assert.deepStrictEqual(
      nonNullListNonNullResolver.resolveToOutputType(),
      new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))),
    )
  })

  it('Should decorate function parameter correctly', () => {
    class Dummy {
      doSomething(
        @Type(GraphQLString) arg: string,
      ) {
        return arg
      }
    }
    const doSomethingResolver = getTypeResolver(Dummy, 'doSomething', 0)!
    assert.deepStrictEqual(doSomethingResolver.resolveToInputType(), GraphQLString)
    assert.deepStrictEqual(doSomethingResolver.resolveToOutputType(), GraphQLString)
  })
})
