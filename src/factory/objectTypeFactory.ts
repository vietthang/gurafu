import {
  GraphQLObjectType,
  GraphQLInputObjectType,
} from 'graphql'

import { getDescription } from '../decorators/description'
import { getObjectTypeName } from '../decorators/objectType'
import { fieldsFactory, inputFieldsFactory } from './fieldsFactory'
import { once, Callable1 } from '../utils'

export const objectTypeFactory: Callable1<Function, GraphQLObjectType> = once((target) => {
  const objectTypeName = getObjectTypeName(target)
  if (!objectTypeName) {
    throw new Error('Missing object type name, target is not decorated with @ObjectType')
  }
  return new GraphQLObjectType({
    name: objectTypeName,
    description: getDescription(target),
    fields: () => fieldsFactory(target),
  })
})

export const inputObjectTypeFactory: Callable1<Function, GraphQLInputObjectType> = once((target) => {
  const objectTypeName = getObjectTypeName(target)
  if (!objectTypeName) {
    throw new Error('Missing object type name, target is not decorated with @ObjectType')
  }
  return new GraphQLInputObjectType({
    name: objectTypeName + 'Input',
    description: getDescription(target),
    fields: () => inputFieldsFactory(target),
  })
})
