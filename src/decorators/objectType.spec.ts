import 'mocha'
import * as assert from 'assert'

import { ObjectType, getObjectTypeName } from './objectType'

describe('Test @ObjectField decorator', () => {
  it('Should get class name if use empty @ObjectType', () => {
    @ObjectType() class Dummy { }
    assert.equal(getObjectTypeName(Dummy), 'Dummy')
  })

  it('Should get custom name if use empty @ObjectType', () => {
    @ObjectType('Custom') class Dummy { }
    assert.equal(getObjectTypeName(Dummy), 'Custom')
  })

  it('Should get undefined name if class not decorated by @ObjectType', () => {
    class Dummy { }
    assert.equal(getObjectTypeName(Dummy), undefined)
  })
})
