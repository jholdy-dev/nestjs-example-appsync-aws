import { Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly userEntity: UserEntity) {}
  async findAll() {
    const result = await this.userEntity.all();
    return result;
  }
}
