import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@codegenie/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';
import { AppModule } from './app.module';
import { buildGraphQLQuery } from './infra/proxy';

let server: Handler;

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AppModule);
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  console.log(
    '================= EVENT =================',
    {
      event,
    },
    '================= EVENT =================',
  );
  server = server ?? (await bootstrap());
  const graphqlSchema = buildGraphQLQuery(event.info, event.arguments);

  const result = await server(
    {
      body: JSON.stringify({
        query: graphqlSchema,
        variables: (event?.info?.variables || event.arguments) ?? {},
        operationName: null,
      }),
      path: '/graphql',
      httpMethod: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...event.headers,
      },
      multiValueHeaders: {
        Accept: ['application/json'],
        'Content-Type': ['application/json'],
      },
      requestContext: {
        path: '/graphql',
        resourcePath: '/{proxy+}',
        httpMethod: 'POST',
      },
    },
    context,
    callback,
  );

  const body = JSON.parse(result.body);

  return body.data[event.info.fieldName];
};
