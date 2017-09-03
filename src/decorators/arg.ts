const parameterNamesSymbol = Symbol('parameterDefaults')

const contextSymbol = Symbol('context')

const infoSymbol = Symbol('context')

export function Arg(name: string): ParameterDecorator {
  return (target: Object, key: string, index: number) => {
    const parametersDefault = Reflect.getMetadata(parameterNamesSymbol, target, key) || {}
    Reflect.defineMetadata(parameterNamesSymbol, {
      ...parametersDefault,
      [index]: name,
    }, target, key)
  }
}

export function getArgName(target: Function, key: string, index: number): string | undefined {
  return (Reflect.getMetadata(parameterNamesSymbol, target.prototype, key) || {})[index]
}

export function Context(): ParameterDecorator {
  return (target: Object, key: string, index: number) => {
    Reflect.defineMetadata(contextSymbol, index, target, key)
  }
}

export function Info(): ParameterDecorator {
  return (target: Object, key: string, index: number) => {
    Reflect.defineMetadata(infoSymbol, index, target, key)
  }
}

export function getContextIndex(target: Function, key: string): number | undefined {
  return Reflect.getMetadata(contextSymbol, target.prototype, key)
}

export function getInfoIndex(target: Function, key: string): number | undefined {
  return Reflect.getMetadata(infoSymbol, target.prototype, key)
}
