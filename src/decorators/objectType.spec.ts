import 'reflect-metadata'
import 'mocha'
import * as assert from 'assert'

import { ObjectType, getObjectTypeName } from './objectType'

describe('Test @ObjectType decorator', () => {
  it('Should add correct metadata without ', () => {
    @ObjectType()
    class Dummy {}

    assert.deepStrictEqual(getObjectTypeName(Dummy), 'Dummy')
  })

  it('Should add correct metadata to interface with specified name', () => {
    @ObjectType('Dummy2')
    class Dummy {
      id: string
    }
    assert.equal(getObjectTypeName(Dummy), 'Dummy2')
  })

  it('Should get undefined metadata if not decorated with @ObjectType', () => {
    class Dummy {
      id: string
    }
    assert.equal(getObjectTypeName(Dummy), undefined)
  })
})
