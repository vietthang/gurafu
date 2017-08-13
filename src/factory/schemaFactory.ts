import { GraphQLObjectType, GraphQLSchema, GraphQLFieldConfigMap } from 'graphql'

import { getType } from '../decorators/schema'
import { fieldsFactory } from './fieldsFactory'

function getFieldsByType(targets: Function[], fieldType: string): GraphQLFieldConfigMap<any, any> {
  return targets.reduce<GraphQLFieldConfigMap<any, any>>(
    (prev, target) => {
      const fieldConfigMap = fieldsFactory(target)

      const fields = Object.keys(fieldConfigMap).reduce<GraphQLFieldConfigMap<any, any>>(
        (prev, key) => {
          const type = getType(target, key)
          if (type === fieldType) {
            return {
              ...prev,
              [key]: fieldConfigMap[key],
            }
          }
          return prev
        },
        {},
      )

      return {
        ...prev,
        ...fields,
      }
    },
    {},
  )
}

export function schemaFactory(...targets: Function[]): GraphQLSchema {
  const queryFields = getFieldsByType(targets, '@Query')
  const queryObjectType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root query',
    fields: queryFields,
  })

  const mutationFields = getFieldsByType(targets, '@Mutation')
  const mutationObjectType = Object.keys(mutationFields).length > 0
    ? new GraphQLObjectType({
      name: 'Mutation',
      description: 'Root mutation',
      fields: mutationFields,
    })
    : undefined

  const subscriptionFields = getFieldsByType(targets, '@Subscription')
  const subscriptionObjectType = Object.keys(subscriptionFields).length > 0
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
