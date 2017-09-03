import 'reflect-metadata'
import 'mocha'
import * as assert from 'assert'

import { Type, getType } from './type'

describe('Test Type decorator', () => {
  it('Should add correct metadata to property', () => {
    class Dummy {
      @Type(String)
      id: string
    }
    assert.equal(getType(Dummy, 'id'), String)
  })

  it('Should get undefined description if property have not decorated with @Description', () => {
    class Dummy {
      id: string
    }
    assert.equal(getType(Dummy, 'id'), undefined)
  })

  it('Should add correct metadata to function parameter', () => {
    class Dummy {
      callSomething(@Type(Number) arg0: number) {
        return
      }
    }
    assert.equal(getType(Dummy, 'callSomething', 0), Number)
  })

  it('Should get undefined description if property have not decorated with @Description', () => {
    class Dummy {
      callSomething(arg0: number) {
        return
      }
    }
    assert.equal(getType(Dummy, 'callSomething', 0), undefined)
  })
})
