import { handler } from '../../src/lambda';
import { queryHello } from './mock';

describe('AppController (e2e)', () => {
  it('/graphql hello', async () => {
    const result = await handler(queryHello, {} as any, {} as any);

    expect(result).toEqual('Hello World!');
  });
});
