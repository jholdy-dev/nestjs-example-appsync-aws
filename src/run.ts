import { getSchema } from './get-schema';

type FunctionType = (...args: any) => any;

export enum Kind {
  Query = 'Query',
  Mutation = 'Mutation',
  Subscription = 'Subscription',
}

export const run = async (kind: Kind, router: string) => {
  const schema = await getSchema();

  const resolveFactory = {
    [Kind.Query]: schema.getQueryType()?.getFields()[router]
      ?.resolve as FunctionType,
    [Kind.Mutation]: schema.getMutationType()?.getFields()[router]
      ?.resolve as FunctionType,
    [Kind.Subscription]: schema.getSubscriptionType()?.getFields()[router]
      ?.resolve as FunctionType,
  };

  const resolve = resolveFactory[kind];

  if (!resolve) {
    throw new Error('Resolver not found');
  }

  return resolve;
};
