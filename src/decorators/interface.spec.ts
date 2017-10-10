import 'reflect-metadata'
import 'mocha'
import * as assert from 'assert'

import { Interface, getInterfaceName } from './interface'

describe('Test @Interface decorator', () => {
  it('Should add correct metadata without ', () => {
    @Interface()
    class Dummy {}

    assert.deepStrictEqual(getInterfaceName(Dummy), 'Dummy')
  })

  it('Should add correct metadata to interface with specified name', () => {
    @Interface('Dummy2')
    class Dummy {
      id: string
    }
    assert.equal(getInterfaceName(Dummy), 'Dummy2')
  })

  it('Should get undefined metadata if not decorated with @Interface', () => {
    class Dummy {
      id: string
    }
    assert.equal(getInterfaceName(Dummy), undefined)
  })
})
