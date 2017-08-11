import { GraphQLObjectType, GraphQLSchema, GraphQLFieldConfigMap } from 'graphql'

import { getType } from '../decorators/schema'
import { fieldsFactory } from './fieldsFactory'

export function schemaFactory(target: Function): GraphQLSchema {
  const fieldConfigMap = fieldsFactory(target)

  const queryFields = Object.keys(fieldConfigMap).reduce<GraphQLFieldConfigMap<any, any>>(
    (prev, key) => {
      const type = getType(target, key)
      if (type === '@Query') {
        return {
          ...prev,
          [key]: fieldConfigMap[key],
        }
      }
      return prev
    },
    {},
  )
  const queryObjectType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root query',
    fields: queryFields,
  })

  const mutationFields = Object.keys(fieldConfigMap).reduce<GraphQLFieldConfigMap<any, any> | undefined>(
    (prev, key) => {
      const type = getType(target, key)
      if (type === '@Mutation') {
        return {
          ...(prev || {}),
          [key]: fieldConfigMap[key],
        }
      }
      return prev
    },
    undefined,
  )
  const mutationObjectType = mutationFields
    ? new GraphQLObjectType({
      name: 'Mutation',
      description: 'Root mutation',
      fields: mutationFields,
    })
    : undefined

  const subscriptionFields = Object.keys(fieldConfigMap).reduce<GraphQLFieldConfigMap<any, any> | undefined>(
    (prev, key) => {
      const type = getType(target, key)
      if (type === '@Subscription') {
        return {
          ...(prev || {}),
          [key]: fieldConfigMap[key],
        }
      }
      return prev
    },
    undefined,
  )
  const subscriptionObjectType = subscriptionFields
    ? new GraphQLObjectType({
      name: 'Subscription',
      description: 'Root subscription',
      fields: subscriptionFields,
    })
    : undefined

  return new GraphQLSchema({
    query: queryObjectType!,
    mutation: mutationObjectType,
    subscription: subscriptionObjectType,
  })
}