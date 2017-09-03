import { GraphQLString, GraphQLBoolean, GraphQLInt, GraphQLFloat } from 'graphql'

import { createDecorator, TypeDecoratorVoid } from './common'

// tslint:disable-next-line:variable-name
export const String: TypeDecoratorVoid = createDecorator(GraphQLString)

// tslint:disable-next-line:variable-name
export const Boolean: TypeDecoratorVoid = createDecorator(GraphQLBoolean)

export const Float: TypeDecoratorVoid = createDecorator(GraphQLFloat)

export const Int: TypeDecoratorVoid = createDecorator(GraphQLInt)
