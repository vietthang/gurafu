import 'reflect-metadata'
import * as assert from 'assert'
import {
  GraphQLObjectTypeConfig,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLInputType,
  GraphQLOutputType,
  GraphQLInputObjectType,
  GraphQLInputFieldConfig,
} from 'graphql'

import { getFieldConfigMap } from './field'
import { getDescription } from './description'

const objectTypeConfigSymbol = Symbol('objectTypeConfig')

const cachedObjectType = Symbol('cachedObjectType')

const cachedInputObjectType = Symbol('cachedInputObjectType')

function mapValues<T, U>(input: { [key: string]: T }, iteratee: (ele: T, key: string) => U): { [key: string]: U } {
  return Object.keys(input).reduce(
    (prev, key) => {
      return {
        ...prev,
        [key]: iteratee(input[key], key),
      }
    },
    {} as { [key: string]: U },
  )
}

export function ObjectType(): Function {
  return (target: Function) => {
    assert(typeof target === 'function')
    const fieldConfigMap = getFieldConfigMap(target)
    if (!fieldConfigMap) {
      throw new Error('Empty field map')
    }
    Reflect.defineMetadata(objectTypeConfigSymbol, {
      name: target.name,
      fields: fieldConfigMap,
    } as GraphQLObjectTypeConfig<any, any>, target.prototype)
  }
}

export function getObjectTypeConfig(target: Function): GraphQLObjectTypeConfig<any, any> | undefined {
  return Reflect.getMetadata(objectTypeConfigSymbol, target.prototype)
}

export function resolveFieldTypeToGraphQLOutputType(fieldType: GraphQLScalarType | Function): GraphQLOutputType {
  if (fieldType instanceof GraphQLScalarType) {
    return fieldType
  }

  return resolveToObjectType(fieldType)
}

export function resolveFieldTypeToGraphQLInputType(fieldType: GraphQLScalarType | Function): GraphQLInputType {
  if (fieldType instanceof GraphQLScalarType) {
    return fieldType
  }

  return resolveToInputObjectType(fieldType)
}

export function resolveToObjectType(target: Function): GraphQLObjectType {
  let objectType: GraphQLObjectType = Reflect.getMetadata(cachedObjectType, target.prototype)
  if (objectType) {
    return objectType
  }

  const description = getDescription(target)
  const fields = getFieldConfigMap(target)
  if (!fields) {
    throw new Error('No field in field config map')
  }
  const objectTypeConfig: GraphQLObjectTypeConfig<any, any> = Reflect.getMetadata(objectTypeConfigSymbol, target.prototype)
  if (!objectTypeConfig) {
    throw new Error(`Missing @ObjectType in ${target.name}`)
  }

  objectType = new GraphQLObjectType({
    ...objectTypeConfig,
    description,
    fields: mapValues(fields, (field, key) => {
      const fieldDescription = getDescription(target, key)
      return {
        type: resolveFieldTypeToGraphQLOutputType(field.type),
        description: fieldDescription,
        resolve: field.resolve,
        args: field.args
          ? mapValues(field.args, () => {
            return {
              type: resolveFieldTypeToGraphQLInputType(field.type),
            } as GraphQLInputFieldConfig
          })
          : undefined,
      }
    }),
  })

  Reflect.defineMetadata(cachedObjectType, objectType, target.prototype)

  return objectType
}

export function resolveToInputObjectType(target: Function): GraphQLInputObjectType {
  let inputObjectType = Reflect.getMetadata(cachedInputObjectType, target.prototype)
  if (inputObjectType) {
    return inputObjectType
  }
  const description = getDescription(target)
  const fields = getFieldConfigMap(target)
  if (!fields) {
    throw new Error('No field in field config map')
  }
  const objectTypeConfig: GraphQLObjectTypeConfig<any, any> = Reflect.getMetadata(objectTypeConfigSymbol, target.prototype)
  if (!objectTypeConfig) {
    throw new Error(`Missing @ObjectType in ${target.name}`)
  }

  inputObjectType = new GraphQLInputObjectType({
    name: 'Input' + objectTypeConfig.name,
    description,
    fields: mapValues(fields, (field, key) => {
      const fieldDescription = getDescription(target, key)
      return {
        type: resolveFieldTypeToGraphQLInputType(field.type),
        description: fieldDescription,
        defaultValue: undefined,
      }
    }),
  })

  Reflect.defineMetadata(cachedInputObjectType, inputObjectType, target.prototype)

  return inputObjectType
}
