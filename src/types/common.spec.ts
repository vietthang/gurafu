import 'reflect-metadata'
import 'mocha'
import * as assert from 'assert'
import { GraphQLString } from 'graphql'

import { getType, TypeResolvable } from '../decorators/type'
import { createDecorator, createGenericDecorator } from './common'

describe('Test createGenericDecorator/createDecorator function', () => {
  it('Should create decorator using createDecorator correctly', () => {
    const StringType = createDecorator(GraphQLString)
    const resolver = StringType()
    assert.deepEqual(GraphQLString, resolver.resolveToInputType())
    assert.deepEqual(GraphQLString, resolver.resolveToOutputType())

    class Dummy {
      @StringType() id: string
    }

    const idType = getType(Dummy, 'id')
    assert.deepEqual(GraphQLString, idType)
  })

  it('Should create decorator using createGenericDecorator correctly', () => {
    const Identity = createGenericDecorator<TypeResolvable>(type => type)

    class Dummy {
      @Identity(GraphQLString) id: string
    }

    const idType = getType(Dummy, 'id')
    assert.deepEqual(GraphQLString, idType)
  })
})
