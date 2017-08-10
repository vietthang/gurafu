import 'reflect-metadata'
import 'source-map-support/register'
import * as assert from 'assert'
import {
  GraphQLFieldResolver,
  GraphQLResolveInfo,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLString,
  GraphQLScalarType,
} from 'graphql'
import * as GraphQLDate from 'graphql-date'

export interface ArgConfig {
  name: string
  type?: GraphQLScalarType | Function,
  defaultValue?: any
  description?: string
}

type ParameterMapConfig = {
  [key: string]: {
    index: number,
    argumentConfig: ArgumentConfig,
  },
}

export interface ArgumentConfig {
  type: GraphQLScalarType | Function
  defaultValue?: any
  description?: string
}

export interface FieldConfigArgumentMap {
  [argName: string]: ArgumentConfig
}

export interface FieldConfig {
  type: GraphQLScalarType | Function
  args?: FieldConfigArgumentMap
  resolve?: GraphQLFieldResolver<any, any>
  deprecationReason?: string
  description?: string
}

export interface FieldConfigMap {
  [name: string]: FieldConfig
}

const fieldsSymbol = Symbol('fields')

const parametersSymbol = Symbol('parameters')

const contextSymbol = Symbol('context')

const infoSymbol = Symbol('info')

function convertDesignTypeToGraphQLType(designType: Function): GraphQLScalarType | Function {
  switch (designType) {
    case Boolean:
      return GraphQLBoolean
    case Number:
      return GraphQLFloat
    case String:
      return GraphQLString
    case Date:
      return GraphQLDate
    case Object:
      throw new Error('Failed to resolve designType')
  }

  return designType
}

export function getFieldConfigMap(target: Function): FieldConfigMap | undefined {
  const ret = Reflect.getMetadata(fieldsSymbol, target.prototype)
  assert(ret === undefined || typeof ret === 'object')
  return ret
}

export function Field(type?: GraphQLScalarType | Function): Function {
  return (target: Object, key: string) => {
    assert(typeof target === 'object')
    assert(typeof key === 'string')
    let resolveFn: GraphQLFieldResolver<any, any> | undefined
    let graphQLOutputType: GraphQLScalarType | Function | undefined = type
    let args: FieldConfigArgumentMap | undefined
    const fields: FieldConfigMap = Reflect.getMetadata(fieldsSymbol, target) || {}

    const fieldDesignType = Reflect.getMetadata('design:type', target, key)
    if (fieldDesignType === Function) {
      const returnDesignType = Reflect.getMetadata('design:returntype', target, key)
      if (!graphQLOutputType) {
        graphQLOutputType = convertDesignTypeToGraphQLType(returnDesignType)
      }
      const parameterConfig: ParameterMapConfig = Reflect.getMetadata(parametersSymbol, target, key) || {}
      args = {}
      Object.keys(parameterConfig).forEach((key) => {
        const { argumentConfig } = parameterConfig[key]
        args![key] = argumentConfig
      })
      resolveFn = (source: any, args: { [argName: string]: any }, context: any, info: GraphQLResolveInfo): any => {
        const functionArgs: any[] = []
        Object.keys(parameterConfig).forEach((key) => {
          const { index } = parameterConfig[key]
          functionArgs[index] = args[key]
        })
        const contextIndex = Reflect.getMetadata(contextSymbol, target, key)
        if (contextIndex !== undefined) {
          functionArgs[contextIndex] = context
        }
        const infoIndex = Reflect.getMetadata(infoSymbol, target, key)
        if (infoIndex !== undefined) {
          functionArgs[infoIndex] = context
        }
        return (target as any)[key].apply(source, functionArgs)
      }
    } else {
      if (!graphQLOutputType) {
        graphQLOutputType = convertDesignTypeToGraphQLType(fieldDesignType)
      }
    }
    if (graphQLOutputType === undefined) {
      throw new Error('Failed to resolve graphQLOutputType')
    }
    Reflect.defineMetadata(fieldsSymbol, {
      ...fields,
      [key]: {
        type: graphQLOutputType,
        resolve: resolveFn,
        args,
      },
    }, target)
  }
}

export function Arg({ name, type, defaultValue, description }: ArgConfig): ParameterDecorator {
  return (target, key, index) => {
    const parametersConfig: ParameterMapConfig = Reflect.getMetadata(parametersSymbol, target, key) || {}
    const designType = Reflect.getMetadata('design:paramtypes', target, key)[index]
    const graphQLInputType = type || convertDesignTypeToGraphQLType(designType)
    const argumentConfig: ArgumentConfig = {
      type: graphQLInputType,
      defaultValue,
      description,
    }
    const newParametersConfig: ParameterMapConfig = {
      ...parametersConfig,
      [name]: {
        index,
        argumentConfig,
      },
    }
    Reflect.defineMetadata(parametersSymbol, newParametersConfig, target, key)
  }
}

export function Context(): ParameterDecorator {
  return (target, key, index) => {
    Reflect.defineMetadata(contextSymbol, index, target, key)
  }
}

export function Info(): ParameterDecorator {
  return (target, key, index) => {
    Reflect.defineMetadata(infoSymbol, index, target, key)
  }
}
