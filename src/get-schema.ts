import { NestFactory } from '@nestjs/core';
import {
  GraphQLSchemaBuilderModule,
  GraphQLSchemaFactory,
} from '@nestjs/graphql';
import { resolvers } from './app.module';

export const getInstances = async () => {
  const app = await NestFactory.create(GraphQLSchemaBuilderModule);
  const gqlSchemaFactory = app.get(GraphQLSchemaFactory);
  const schema = await gqlSchemaFactory.create(resolvers);

  const mutations = Object.keys(schema.getMutationType()?.getFields() || {});
  const queries = Object.keys(schema.getQueryType()?.getFields() || {});
  const instances = [
    ...mutations.map((lambdaName) => ({ lambdaName, kind: 'Mutation' })),
    ...queries.map((lambdaName) => ({ lambdaName, kind: 'Query' })),
  ];

  return instances;
};
