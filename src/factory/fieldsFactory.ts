import {
  GraphQLFieldResolver,
  GraphQLFieldConfigArgumentMap,
  GraphQLFieldConfigMap,
  GraphQLInputFieldConfigMap,
} from 'graphql'

import { getFieldNameMap } from '../decorators/field'
import { getDescription } from '../decorators/description'
import { getTypeResolver, createTypeResolver, TypeResolvable } from '../decorators/type'
import { getDepricationReason } from '../decorators/deprecated'
import { getArgName, getContextIndex, getInfoIndex } from '../decorators/arg'
import { getDefault } from '../decorators/default'
import { once, Callable1 } from '../utils'

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
      let typeResolver = getTypeResolver(target, key)
      let resolveFn: GraphQLFieldResolver<any, any> | undefined
      let args: GraphQLFieldConfigArgumentMap | undefined
      const fieldDesignType: Function = Reflect.getMetadata('design:type', target.prototype, key)
      if (!typeResolver) {
        if (!fieldDesignType) {
          throw new Error('Failed to resolve GraphQLType. Can not find field design type')
        }
        if (fieldDesignType === Function) {
          const returnDesignType = Reflect.getMetadata('design:returntype', target.prototype, key)
          typeResolver = createTypeResolver(returnDesignType)
        } else {
          typeResolver = createTypeResolver(fieldDesignType as TypeResolvable)
        }
      }
      if (fieldDesignType === Function) {
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
          let argTypeResolver = getTypeResolver(target, key, i)
          if (!argTypeResolver) {
            argTypeResolver = createTypeResolver(paramTypes[i])
          }

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
            if (args[argName] === undefined) {
              throw new Error(`Argument ${argName} does not exist`)
            }
            fnArgs[i] = args[argName]
          }
          return target.prototype[key].apply(source, fnArgs)
        }
      }

      return {
        ...prev,
        [name]: {
          type: typeResolver.resolveToOutputType(),
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
    let typeResolver = getTypeResolver(target, key)
    const fieldDesignType = Reflect.getMetadata('design:type', target.prototype, key)
    if (!typeResolver) {
      if (!fieldDesignType) {
        throw new Error('Failed to resolve GraphQLType. Can not find field design type')
      }
      typeResolver = createTypeResolver(fieldDesignType)
    }
    return {
      type: typeResolver.resolveToInputType(),
      description,
      defaultValue: getDefault(target, key),
    }
  })
})
