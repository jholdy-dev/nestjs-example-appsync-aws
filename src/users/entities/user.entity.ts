import {
  Table,
  Entity,
  schema,
  attribute,
  ScanCommand,
  GetItemCommand,
  PutItemCommand,
  DeleteItemCommand,
  UpdateItemCommand,
  QueryCommand,
  Query,
} from 'dynamodb-toolbox';
import { DatabaseService } from '../../database/database.service';
import { User } from './user.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserEntity {
  private table: Table;
  private entity: Entity;

  constructor(dbService: DatabaseService) {
    this.table = new Table({
      documentClient: dbService.get(),
      name: process.env.USERS_TABLE_NAME,
      partitionKey: {
        name: 'id',
        type: 'string',
      },
    });

    const instance = new Entity({
      name: process.env.USERS_TABLE_NAME,
      table: this.table,
      schema: schema({
        id: attribute.string().key(),
      }),
    });

    this.entity = instance;
  }

  async all() {
    const result = await this.table
      .build(ScanCommand)
      .entities(this.entity)
      .send();

    return result.Items as User[];
  }

  async query(query: Query<typeof this.table>) {
    const result = await this.table.build(QueryCommand).query(query).send();

    return result.Items as User[];
  }

  async get(id: string) {
    const result = await this.entity.build(GetItemCommand).key({ id }).send();

    return result.Item as User;
  }

  async save(user: User) {
    const result = await this.entity
      .build(PutItemCommand)
      .item({
        ...user,
      })
      .send();

    return result.Attributes as User;
  }

  update(user: User) {
    return this.entity
      .build(UpdateItemCommand)
      .item({
        id: user.id,
      })
      .send();
  }

  async delete(id: string) {
    const result = await this.entity
      .build(DeleteItemCommand)
      .key({ id })
      .send();

    return result.Attributes as User;
  }
}
