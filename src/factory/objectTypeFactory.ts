import {
  GraphQLObjectType,
  GraphQLInputObjectType,
} from 'graphql'

import { getObjectTypeName } from '../decorators/objectType'
import { getDescription } from '../decorators/description'
import { fieldsFactory, inputFieldsFactory } from './fieldsFactory'

const cachedObjectType = Symbol('cachedObjectType')

const cachedInputObjectType = Symbol('cachedInputObjectType')

export function objectTypeFactory(target: Function): GraphQLObjectType {
  let objectType = Reflect.getMetadata(cachedObjectType, target.prototype)
  if (objectType) {
    return objectType
  }

  const description = getDescription(target)
  const name = getObjectTypeName(target)
  if (!name) {
    throw new Error(`Missing @ObjectType in ${target.name}`)
  }

  objectType = new GraphQLObjectType({
    name,
    description,
    fields: fieldsFactory(target),
  })

  Reflect.defineMetadata(cachedObjectType, objectType, target.prototype)

  return objectType
}

export function inputObjectTypeFactory(target: Function): GraphQLInputObjectType {
  let inputObjectType = Reflect.getMetadata(cachedInputObjectType, target.prototype)
  if (inputObjectType) {
    return inputObjectType
  }

  const description = getDescription(target)
  const name = getObjectTypeName(target)
  if (!name) {
    throw new Error(`Missing @ObjectType in ${target.name}`)
  }

  inputObjectType = new GraphQLInputObjectType({
    name: name + 'Input',
    description,
    fields: inputFieldsFactory(target),
  })

  Reflect.defineMetadata(cachedInputObjectType, inputObjectType, target.prototype)

  return inputObjectType
}
