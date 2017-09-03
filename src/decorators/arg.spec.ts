import 'reflect-metadata'
import 'mocha'
import * as assert from 'assert'

import { Arg, getArgName, Context, getContextIndex, Info, getInfoIndex } from './arg'

describe('Test @Arg/@Context/@Info decorator', () => {
  it('Should add correct metadata to class', () => {
    class Dummy {
      callSomething(
        @Arg('decorated') decorated: string,
        nonDecorated: string,
        @Context() context: any,
        @Info() info: any,
      ) {
        return
      }
    }

    assert.equal(getArgName(Dummy, 'callSomething', 0), 'decorated')
    assert.equal(getArgName(Dummy, 'callSomething', 1), undefined)
    assert.equal(getArgName(Dummy, 'callSomething', 2), undefined)
    assert.equal(getContextIndex(Dummy, 'callSomething'), 2)
    assert.equal(getInfoIndex(Dummy, 'callSomething'), 3)
    assert.equal(getArgName(Dummy, 'invalidKey', 0), undefined)
    assert.equal(getContextIndex(Dummy, 'invalidKey'), undefined)
    assert.equal(getInfoIndex(Dummy, 'invalidKey'), undefined)
  })
})
