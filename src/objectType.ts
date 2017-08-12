import { GraphQLInputType, GraphQLOutputType } from 'graphql'

import { objectTypeFactory, inputObjectTypeFactory } from './factory/objectTypeFactory'

export class ObjectType {

  // dummy property to safe guard class extends from this class
  readonly _?: any

  static resolveToInputType(): GraphQLInputType {
    return inputObjectTypeFactory(this)
  }

  static resolveToOutputType(): GraphQLOutputType {
    return objectTypeFactory(this)
  }

}

export type GraphObjectConstructor = new () => ObjectType
