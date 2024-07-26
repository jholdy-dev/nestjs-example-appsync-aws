#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { RestApiStack } from '../lib/rest_api-stack';
import { getInstances } from '../src/get-schema';

const app = new cdk.App();

(async () => {
  const instances = await getInstances();
  new RestApiStack(app, 'RestApiStack', { instances });
})();
