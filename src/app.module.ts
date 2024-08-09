import { HelloResolver } from './hello.resolver';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PubSub } from 'graphql-subscriptions';
import { UsersModule } from './users/users.module';
import { DatabaseService } from './database/database.service';
import { UserEntity } from './users/entities/user.entity';

export const resolvers = [HelloResolver];

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      installSubscriptionHandlers: true,
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [
    ...resolvers,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
    DatabaseService,
    UserEntity,
  ],
})
export class AppModule {}
