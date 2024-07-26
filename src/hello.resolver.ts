import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Resolver()
export class HelloResolver {
  @Query(() => String)
  async hello() {
    return 'Hello World!';
  }

  @Mutation(() => String)
  async sendMessage(
    @Args('content') content: string,
    @Args('sender') sender: string,
  ) {
    const message = { content, sender };
    pubSub.publish('messageSent', { messageSent: message.content });
    return 'Message sent!';
  }

  @Subscription(() => String)
  messageSent() {
    return pubSub.asyncIterator('messageSent');
  }
}
