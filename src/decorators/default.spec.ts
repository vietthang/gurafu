import 'mocha'
import * as assert from 'assert'

import { Default, getDefault } from './default'

describe('Test @Default decorator', () => {
  it('Should add correct metadata to class', () => {
    class Dummy {
      @Default('#ID')
      id: string
    }
    assert.equal(getDefault(Dummy, 'id'), '#ID')
  })

  it('Should get undefined description if class have not decorated with @Description', () => {
    class Dummy {}
    assert.equal(getDefault(Dummy, 'id'), undefined)
  })

  it('Should add correct metadata to function parameter', () => {
    class Dummy {
      callSomething(@Default('Argument 0') arg0: number) {
        console.log('Empty')
      }
    }
    assert.equal(getDefault(Dummy, 'callSomething', 0), 'Argument 0')
  })

  it('Should get undefined description if property have not decorated with @Description', () => {
    class Dummy {
      callSomething(arg0: number) {
        console.log('Empty')
      }
    }
    assert.equal(getDefault(Dummy, 'callSomething', 0), undefined)
  })
})
