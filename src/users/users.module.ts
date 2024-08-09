import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { DatabaseService } from '../database/database.service';
import { UserEntity } from './entities/user.entity';

@Module({
  providers: [UsersResolver, UsersService, UserEntity, DatabaseService],
})
export class UsersModule {}
