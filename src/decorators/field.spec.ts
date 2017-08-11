import 'mocha'
import * as assert from 'assert'

import { Field, getFieldNameMap } from './field'

describe('Test @Field decorator', () => {
  it('Should add correct metadata to property', () => {
    class Dummy {
      @Field()
      id: string

      @Field('custom')
      name: string

      nonDecorated: string
    }
    assert.deepStrictEqual(getFieldNameMap(Dummy), {
      id: 'id',
      name: 'custom',
    })
  })

  it('Should get undefined deprication reason if property have not decorated with @Deprecated', () => {
    class Dummy {
      id: string
    }
    assert.equal(getFieldNameMap(Dummy), undefined)
  })
})
