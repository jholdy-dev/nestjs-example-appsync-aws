import { ObjectType, Field } from '@nestjs/graphql';
import { MapperModel } from '../../database/models/mapper.model';

@ObjectType()
export class User extends MapperModel {
  @Field(() => String)
  id: string;
}
