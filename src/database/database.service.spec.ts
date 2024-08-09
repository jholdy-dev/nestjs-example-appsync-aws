import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from './database.service';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

describe('DatabaseService', () => {
  let service: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseService],
    }).compile();

    service = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be DynamoDBDocumentClient', () => {
    expect(service.get()).toBeInstanceOf(DynamoDBDocumentClient);
  });
});
