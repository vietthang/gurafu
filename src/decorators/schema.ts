import 'reflect-metadata'
import * as assert from 'assert'
import { GraphQLObjectType, GraphQLOutputType, GraphQLSchema } from 'graphql'

import { resolveToObjectType } from './objectType'

const mutationSymbol = Symbol('mutation')

const querySymbol = Symbol('query')

export function Mutation(type?: GraphQLOutputType | Function): PropertyDecorator {
  return (target, key) => {
    assert.equal(typeof key, 'string')
    Reflect.defineMetadata(mutationSymbol, key, target)
  }
}

export function Query(): PropertyDecorator {
  return (target, key) => {
    assert.equal(typeof key, 'string')
    Reflect.defineMetadata(querySymbol, key, target)
  }
}

export function buildGraphQLSchema(target: Function): GraphQLSchema {
  const queryField = Reflect.getMetadata(querySymbol, target.prototype)
  if (!queryField) {
    throw new Error('Missing @Query')
  }

  const queryDesignType = Reflect.getMetadata('design:type', target.prototype, queryField)
  assert.equal(typeof queryDesignType, 'function')
  const queryType = resolveToObjectType(queryDesignType)
  assert(queryType)

  let mutationType: GraphQLObjectType | undefined
  const mutationField = Reflect.getMetadata(mutationSymbol, target.prototype)
  if (mutationField) {
    const mutationDesignType = Reflect.getMetadata('design:type', target.prototype, mutationField)
    assert(typeof mutationDesignType, 'function')
    mutationType = resolveToObjectType(mutationDesignType)
    assert(mutationField)
  }

  return new GraphQLSchema({
    query: queryType!,
    mutation: mutationType,
  })
}
