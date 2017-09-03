import {
  GraphQLFieldResolver,
  GraphQLFieldConfigArgumentMap,
  GraphQLFieldConfigMap,
  GraphQLInputFieldConfigMap,
} from 'graphql'

import { once, Callable1 } from '../utils'
import { getFieldNameMap } from '../decorators/field'
import { getDescription } from '../decorators/description'
import { getType } from '../decorators/type'
import { getDepricationReason } from '../decorators/deprecated'
import { getArgName, getContextIndex, getInfoIndex } from '../decorators/arg'
import { getDefault } from '../decorators/default'
import { getTypeResolver } from './typeFactory'

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

export const fieldsFactory: Callable1<Function, GraphQLFieldConfigMap<any, any>> = once((target: Function) => {
  const fieldNameMap = getFieldNameMap(target)
  if (!fieldNameMap) {
    throw new Error(`Can not find field info in ${target.name} class`)
  }
  return Object.keys(fieldNameMap).reduce<GraphQLFieldConfigMap<any, any>>(
    (prev, key) => {
      const name = fieldNameMap[key]
      const description = getDescription(target, key)
      const deprecationReason = getDepricationReason(target, key)
      const keyType = getType(target, key)
      let resolveFn: GraphQLFieldResolver<any, any> | undefined
      let args: GraphQLFieldConfigArgumentMap | undefined
      if (!keyType) {
        throw new Error(`Missing type decorator for key ${key} in ${target.name}`)
      }
      if (typeof target.prototype[key] === 'function') {
        const argumentsLength: number = target.prototype[key].length
        const contextIndex = getContextIndex(target, key)
        const infoIndex = getInfoIndex(target, key)
        args = {}
        const paramTypes = Reflect.getMetadata('design:paramtypes', target.prototype, key)
        for (let i = 0; i < argumentsLength; i++) {
          const argName = getArgName(target, key, i)
          if (!argName) {
            continue
          }
          const type = getType(target, key, i)
          const argTypeResolver = getTypeResolver(type || paramTypes[i])

          args[argName] = {
            type: argTypeResolver.resolveToInputType(),
            defaultValue: getDefault(target, key, i),
            description: getDescription(target, key, i),
          }
        }
        resolveFn = (source, args, context, info) => {
          const fnArgs = new Array<any>(argumentsLength)
          for (let i = 0; i < argumentsLength; i++) {
            if (i === contextIndex) {
              fnArgs[i] = context
              continue
            }
            if (i === infoIndex) {
              fnArgs[i] = info
              continue
            }
            const argName = getArgName(target, key, i)
            if (!argName) {
              throw new Error('Can not find arg in argument index')
            }
            fnArgs[i] = args[argName]
          }
          return target.prototype[key].apply(source, fnArgs)
        }
      }

      return {
        ...prev,
        [name]: {
          type: getTypeResolver(keyType).resolveToOutputType(),
          description,
          deprecationReason,
          resolve: resolveFn,
          args,
        },
      }
    },
    {},
  )
})

export const inputFieldsFactory: Callable1<Function, GraphQLInputFieldConfigMap> = once((target: Function) => {
  const fieldNameMap = getFieldNameMap(target)
  if (!fieldNameMap) {
    throw new Error(`Can not find field info in ${target.name} class`)
  }
  return mapValues(fieldNameMap, (name, key) => {
    const description = getDescription(target, key)
    const keyType = getType(target, key)
    if (!keyType) {
      throw new Error(`Missing type decorator for key ${key} in ${target.name}`)
    }
    return {
      type: getTypeResolver(keyType).resolveToInputType(),
      description,
      defaultValue: getDefault(target, key),
    }
  })
})
