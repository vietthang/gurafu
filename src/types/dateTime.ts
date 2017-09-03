import { GraphQLScalarType, GraphQLError } from 'graphql'

import { createDecorator, TypeDecoratorVoid } from './common'

export const GraphQLDateTime = new GraphQLScalarType({
  name: 'DateTime',
  description: 'DateTime value, represent as a long value',
  serialize(value: any) {
    if (!(value instanceof Date)) {
      throw new GraphQLError('Internal date can only be a Date')
    }

    return value.getTime()
  },
  parseValue(value: any) {
    if (value instanceof Date) {
      return value
    }

    if (typeof value !== 'number') {
      throw new GraphQLError('Date value has to be long integer')
    }

    return new Date(value)
  },
  parseLiteral(valueNode) {
    if (valueNode.kind !== 'IntValue') {
      throw new GraphQLError('Date value has to be long integer')
    }

    return new Date(parseInt(valueNode.value, 10))
  },
})

export const DateTime: TypeDecoratorVoid = createDecorator(GraphQLDateTime)
