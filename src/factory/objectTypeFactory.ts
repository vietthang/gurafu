import {
  GraphQLObjectType,
  GraphQLInputObjectType,
} from 'graphql'

import { getObjectTypeName } from '../decorators/objectType'
import { getDescription } from '../decorators/description'
import { fieldsFactory, inputFieldsFactory } from './fieldsFactory'
import { once, Callable1 } from '../utils'

export const objectTypeFactory: Callable1<Function,GraphQLObjectType> = once((target) => {
  const description = getDescription(target)
  const name = getObjectTypeName(target)
  if (!name) {
    throw new Error(`Missing @ObjectType in ${target.name}`)
  }

  return new GraphQLObjectType({
    name,
    description,
    fields: fieldsFactory(target),
  })
})

export const inputObjectTypeFactory: Callable1<Function,GraphQLInputObjectType> = once((target) => {
  const description = getDescription(target)
  const name = getObjectTypeName(target)
  if (!name) {
    throw new Error(`Missing @ObjectType in ${target.name}`)
  }

  return new GraphQLInputObjectType({
    name: name + 'Input',
    description,
    fields: inputFieldsFactory(target),
  })
})
