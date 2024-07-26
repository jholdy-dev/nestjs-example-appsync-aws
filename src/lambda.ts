import { AppSyncResolverEvent } from 'aws-lambda';
import { GraphQLError } from 'graphql';
import { run, Kind } from './run';

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

export const handler = async (
  event: AppSyncResolverEvent<unknown, unknown>,
) => {
  const { parentTypeName, fieldName } = event.info;
  try {
    const resolve = await run(parentTypeName as Kind, fieldName);

    return await resolve(fieldName, event.arguments);
  } catch (error) {
    return new GraphQLError(getErrorMessage(error));
  }
};
