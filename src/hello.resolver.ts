import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { aws_subscribe } from './infra/appsync/directives/subscription';
import { Inject } from '@nestjs/common';

@Resolver()
export class HelloResolver {
  constructor(@Inject('PUB_SUB') private pubSub: PubSub) {}

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
    this.pubSub.publish('messageSent', { messageSent: message.content });
    return 'Message sent!';
  }

  @aws_subscribe('mutations', ['sendMessage'])
  @Subscription(() => String)
  messageSent() {
    return this.pubSub.asyncIterator('messageSent');
  }
}
