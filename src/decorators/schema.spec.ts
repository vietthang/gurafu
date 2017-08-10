import 'mocha'
import * as assert from 'assert'
import { GraphQLSchema } from 'graphql'

import { ObjectType, resolveToObjectType } from './objectType'
import { Mutation, Query, buildGraphQLSchema } from './schema'
import { Arg, Field } from './field'

@ObjectType() class User {
  @Field()
  id: string

  @Field()
  email: string
}
@ObjectType() class UserUpdate {
  @Field()
  email: string
}
@ObjectType() class SchemaMutation {
  @Field()
  updateUser(
    @Arg({ name: 'id' }) id: string,
    @Arg({ name: 'body' }) body: UserUpdate,
  ): User {
    const user = new User()
    user.id = id
    user.email = body.email
    return user
  }
}
@ObjectType() class SchemaQuery {
  @Field()
  me(): User {
    const user = new User()
    user.id = 'id'
    user.email = 'email'
    return user
  }
}

describe('Test Schema', () => {
  it('Should create new GraphQLSchema correctly', () => {

    class Schema {
      @Mutation()
      mutation: SchemaMutation

      @Query()
      query: SchemaQuery
    }

    const graphQLSchema = buildGraphQLSchema(Schema)
    assert.deepEqual(graphQLSchema, new GraphQLSchema({
      query: resolveToObjectType(SchemaQuery),
      mutation: resolveToObjectType(SchemaMutation),
    }))
  })

  it('Should fail to create GraphQLSchema without @Query', () => {
    class Schema {
      @Mutation()
      mutation: SchemaMutation

      query: SchemaQuery
    }

    assert.throws(() => buildGraphQLSchema(Schema))
  })

  it('Should create new GraphQLSchema correctly without @Mutation', () => {
    class Schema {
      @Query()
      query: SchemaQuery
    }

    const graphQLSchema = buildGraphQLSchema(Schema)
    assert.deepEqual(graphQLSchema, new GraphQLSchema({
      query: resolveToObjectType(SchemaQuery),
    }))
  })
})
