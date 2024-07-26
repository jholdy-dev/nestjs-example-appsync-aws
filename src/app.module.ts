import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { YogaDriverConfig, YogaDriver } from '@graphql-yoga/nestjs';
import { GraphQLModule } from '@nestjs/graphql';
import { useGraphQLSSE } from '@graphql-yoga/plugin-graphql-sse';
import { HelloResolver } from './hello.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot<YogaDriverConfig>({
      autoSchemaFile: true,
      driver: YogaDriver,
      plugins: [useGraphQLSSE()],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, HelloResolver],
})
export class AppModule {}
