import 'reflect-metadata'
import 'mocha'
import * as assert from 'assert'

import { Description, getDescription } from './description'

describe('Test Description decorator', () => {
  it('Should add correct metadata to class', () => {
    @Description('Dummy class')
    class Dummy {}
    assert.equal(getDescription(Dummy), 'Dummy class')
  })

  it('Should get undefined description if class have not decorated with @Description', () => {
    class Dummy {}
    assert.equal(getDescription(Dummy), undefined)
  })

  it('Should add correct metadata to property', () => {
    class Dummy {
      @Description('ID')
      id: string
    }
    assert.equal(getDescription(Dummy, 'id'), 'ID')
  })

  it('Should get undefined description if property have not decorated with @Description', () => {
    class Dummy {
      id: string
    }
    assert.equal(getDescription(Dummy, 'id'), undefined)
  })

  it('Should add correct metadata to function parameter', () => {
    class Dummy {
      callSomething(@Description('Argument 0') arg0: number) {
        return
      }
    }
    assert.equal(getDescription(Dummy, 'callSomething', 0), 'Argument 0')
  })

  it('Should get undefined description if property have not decorated with @Description', () => {
    class Dummy {
      callSomething(arg0: number) {
        return
      }
    }
    assert.equal(getDescription(Dummy, 'callSomething', 0), undefined)
  })
})
