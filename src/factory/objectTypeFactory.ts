import {
  GraphQLObjectType,
  GraphQLInputObjectType,
} from 'graphql'

import { GraphObjectConstructor } from '../objectType'
import { getDescription } from '../decorators/description'
import { fieldsFactory, inputFieldsFactory } from './fieldsFactory'
import { once, Callable1 } from '../utils'

export const objectTypeFactory: Callable1<GraphObjectConstructor, GraphQLObjectType> = once((target) => {
  return new GraphQLObjectType({
    name: target.name,
    description: getDescription(target),
    fields: () => fieldsFactory(target),
  })
})

export const inputObjectTypeFactory: Callable1<GraphObjectConstructor, GraphQLInputObjectType> = once((target) => {
  return new GraphQLInputObjectType({
    name: target.name + 'Input',
    description: getDescription(target),
    fields: () => inputFieldsFactory(target),
  })
})
