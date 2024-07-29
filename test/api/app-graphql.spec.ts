import { handler } from '../../src/lambda';
import { queryHello } from './mock';
import { mutationSendMessage } from './mock';

describe('AppController (e2e)', () => {
  it('/graphql hello', async () => {
    const result = await handler(queryHello, {} as any, {} as any);

    expect(result).toEqual('Hello World!');
  });
  it('/graphql sendMessage', async () => {
    const result = await handler(mutationSendMessage, {} as any, {} as any);

    expect(result).toEqual('Message sent!');
  });
});
