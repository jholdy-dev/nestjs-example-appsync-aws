#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AppSyncStack } from './../lib/rest_api-stack';
import { generateSchema, getInstances } from './../src/infra/get-schema';
import { DBStack } from './../lib/db-stack';

const app = new cdk.App();

(async () => {
  const schema = await generateSchema();
  const instances = await getInstances();
  const api = new AppSyncStack(app, 'RestApiStack-TEST', { schema, instances });
  new DBStack(app, 'DBStack', { lambda: api.lambda });
})();
