const defaultSymbol = Symbol('default')

const parameterDefaultsSymbol = Symbol('parameterDefaults')

export function Default(defaultValue: any): Function {
  return (target: any, key: string, index?: number | PropertyDecorator) => {
    if (typeof index === 'number') {
      const parametersDefault = Reflect.getMetadata(parameterDefaultsSymbol, target) || {}
      Reflect.defineMetadata(parameterDefaultsSymbol, {
        ...parametersDefault,
        [index]: defaultValue,
      }, target, key)
    } else {
      Reflect.defineMetadata(defaultSymbol, defaultValue, target, key)
    }
  }
}

export function getDefault(target: Function, key: string, index?: number): any | undefined {
  if (index === undefined) {
    return Reflect.getMetadata(defaultSymbol, target.prototype, key)
  } else {
    return (Reflect.getMetadata(parameterDefaultsSymbol, target.prototype, key) || {})[index]
  }
}
