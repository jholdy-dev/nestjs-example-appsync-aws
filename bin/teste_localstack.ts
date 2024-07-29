#!/usr/bin/env node
import 'source-map-support/register';
import { generateSchema, getInstances } from '../src/get-schema';

(async () => {
  const schema = await generateSchema();
  const instances = await getInstances();
  console.log({
    schema,
    instances,
  });
})();
