import 'reflect-metadata'
import 'mocha'
import * as assert from 'assert'

import { Deprecated, getDepricationReason } from './deprecated'

describe('Test @Deprecated decorator', () => {
  it('Should add correct metadata to property', () => {
    class Dummy {
      @Deprecated('Old version')
      id: string
    }
    assert.equal(getDepricationReason(Dummy, 'id'), 'Old version')
  })

  it('Should get undefined deprication reason if property have not decorated with @Deprecated', () => {
    class Dummy {
      id: string
    }
    assert.equal(getDepricationReason(Dummy, 'id'), undefined)
  })
})
