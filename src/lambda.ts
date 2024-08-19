import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@codegenie/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';
import { AppModule } from './app.module';
import { getEventHttp } from './infra/proxy';

let server: Handler;

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AppModule);
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  appSyncResolverEvent: any,
  context: Context,
  callback: Callback,
) => {
  console.log(
    '================= EVENT =================',
    {
      event: JSON.stringify(appSyncResolverEvent),
    },
    '================= EVENT =================',
  );

  if (appSyncResolverEvent.authorizationToken) {
    return {
      isAuthorized: true,
      resolverContext: {
        user: 'authenticatedUser',
      },
    };
  }

  server = server ?? (await bootstrap());

  const eventHttp = getEventHttp(appSyncResolverEvent);

  const result = await server(eventHttp, context, callback);

  const body = JSON.parse(result.body);

  return body.data[appSyncResolverEvent.info.fieldName];
};
