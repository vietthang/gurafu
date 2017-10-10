import 'reflect-metadata'
import 'mocha'
import * as assert from 'assert'

import { Implement, getInterfaces } from './implement'

describe('Test @Interface decorator', () => {
  it('Should add correct metadata without ', () => {
    class IDummy { }
    @Implement(IDummy)
    class Dummy { }

    assert.deepEqual(getInterfaces(Dummy), [IDummy])
  })

  it('Should get empty interface list if not decorated with @Implement', () => {
    class Dummy { }
    assert.deepEqual(getInterfaces(Dummy), [])
  })

  it('Should get correct list of interfaces when applied multiple times', () => {
    class IDummy1 { }
    class IDummy2 { }
    class IDummy3 { }
    class IDummy4 { }

    const idummy4Thunk = () => IDummy4

    @Implement(IDummy3, idummy4Thunk)
    @Implement(IDummy2)
    @Implement(IDummy1)
    class Dummy { }

    assert.deepEqual(getInterfaces(Dummy), [IDummy1, IDummy2, IDummy3, idummy4Thunk])
  })
})
