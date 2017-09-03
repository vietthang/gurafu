import 'reflect-metadata'
import 'mocha'
import * as assert from 'assert'

import { Mutation, Query, Subscription, getType } from './schema'

describe('Test @Query/@Mutation/@Subscription', () => {
  it('Should generate metadata correctly', () => {
    class Schema {
      notDecorated: any

      @Mutation() createUser: any

      @Mutation() updateUser: any

      @Query() users() {
        return []
      }

      @Subscription() userChanged() {
        return
      }
    }

    assert.equal(getType(Schema, 'createUser'), '@Mutation')
    assert.equal(getType(Schema, 'updateUser'), '@Mutation')
    assert.equal(getType(Schema, 'users'), '@Query')
    assert.equal(getType(Schema, 'userChanged'), '@Subscription')
    assert.equal(getType(Schema, 'invalid'), undefined)
    assert.equal(getType(Schema, 'notDecorated'), undefined)
  })

  it('Should failed if a field decorated with more than 1 time', () => {
    assert.throws(() => {
      class Dummy {
        @Query()
        @Query()
        invalid: any
      }
      new Dummy()
    })
    assert.throws(() => {
      class Dummy {
        @Mutation()
        @Query()
        invalid: any
      }
      new Dummy()
    })
    assert.throws(() => {
      class Dummy {
        @Subscription()
        @Query()
        invalid: any
      }
      new Dummy()
    })
  })
})
