export { Type } from './decorators/type'

export { Arg, Context, Info } from './decorators/arg'

export { Field } from './decorators/field'

export { Description } from './decorators/description'

export { Deprecated } from './decorators/deprecated'

export { Default } from './decorators/default'

export { Query, Mutation, Subscription } from './decorators/schema'

export { ObjectType } from './decorators/objectType'

export { schemaFactory } from './factory/schemaFactory'

export { List } from './types/list'

export { NonNull } from './types/nonNull'

export { ID } from './types/id'

export { Collection } from './types/collection'

export { String, Boolean, Float, Int } from './types/native'

export { Nil, GraphQLNil } from './types/nil'

export { DateTime, GraphQLDateTime } from './types/dateTime'

export function decorate(): Function {
  return (target: any, key: any, valueOrIndex: any, descriptor: any) => {
    console.log('##########')
    console.log('target', target)
    console.log('key', key)
    console.log('valueOrIndex', valueOrIndex)
    console.log('descriptor', descriptor)
  }
}

@decorate()
export class User {

  @decorate()
  static staticInnerClass = class UserCreation {

  }

  @decorate()
  static staticMethod(id: string, @decorate() staticMethodArg: any) {

  }

  @decorate()
  static staticProperty: string

  @decorate()
  memberProperty: string = 'a'

  @decorate()
  memberMethod(id: string, @decorate() memberMethodArg: any) {

  }

}
