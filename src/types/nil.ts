import { GraphQLScalarType } from 'graphql'

import { createDecorator, TypeDecoratorVoid } from './common'

export const GraphQLNil = new GraphQLScalarType({
  name: 'Nil',
  description: 'Empty value, useful for no content result, coerce any value to null',
  serialize(value: any) {
    return null
  },
  parseValue(value: any) {
    return null
  },
  parseLiteral(valueNode) {
    return null
  },
})

export const Nil: TypeDecoratorVoid = createDecorator(GraphQLNil)
