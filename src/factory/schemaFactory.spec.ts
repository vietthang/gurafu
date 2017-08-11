import 'mocha'
import * as assert from 'assert'

import { ObjectType } from '../decorators/objectType'
import { Field } from '../decorators/field'
import { Arg } from '../decorators/arg'
import { Query, Mutation, Subscription } from '../decorators/schema'
import { schemaFactory } from './schemaFactory'
import { objectTypeFactory } from './objectTypeFactory'

describe('Test schemaFactory', () => {
  it('Should generate GraphQLSchema with simple fields correctly', () => {
    @ObjectType() class User {
      @Field() id: string
      @Field() email: string
    }

    @ObjectType() class UserUpdate {
      @Field() email: string
    }

    @ObjectType() class UserChanged {
      @Field() email: string
    }

    class Schema {
      @Query() user: User

      @Subscription() userChanged: UserChanged

      @Mutation()
      updateUser(
        @Arg('id') id: string,
        @Arg('body') body: UserUpdate,
      ): User {
        const user = new User()
        user.id = id
        user.email = body.email
        return user
      }

    }

    const graphQLSchema = schemaFactory(Schema)
    const queryType = graphQLSchema.getQueryType()

    assert.equal(queryType.name, 'Query')
    assert.equal(queryType.description, 'Root query')
    assert.deepEqual(
      queryType.getFields(),
      {
        user: {
          type: objectTypeFactory(User),
          name: 'user',
          description: undefined,
          args: [],
          resolve: undefined,
          isDeprecated: false,
          deprecationReason: undefined,
        },
      },
    )

    const subscriptionType = graphQLSchema.getSubscriptionType()!
    assert.equal(subscriptionType.name, 'Subscription')
    assert.equal(subscriptionType.description, 'Root subscription')
    assert.deepEqual(
      subscriptionType.getFields(),
      {
        userChanged: {
          type: objectTypeFactory(UserChanged),
          name: 'userChanged',
          description: undefined,
          args: [],
          resolve: undefined,
          isDeprecated: false,
          deprecationReason: undefined,
        },
      },
    )

    const mutationType = graphQLSchema.getMutationType()!
    assert.deepEqual(mutationType.name, 'Mutation')
    assert.deepEqual(mutationType.description, 'Root mutation')
    const updateUserField = mutationType.getFields().updateUser
    assert.deepEqual(
      updateUserField.resolve!(null, { id: '#ID', body: { email: 'example@example.com' } }, null, null as any),
      {
        id: '#ID',
        email: 'example@example.com',
      },
    )
  })
})