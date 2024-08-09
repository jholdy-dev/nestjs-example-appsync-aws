import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DatabaseService {
  client: DynamoDBDocumentClient;
  constructor() {
    const clientConfig = {
      region: process.env.CDK_REGION!,
    };

    const client = new DynamoDBClient({
      region: clientConfig.region,
      endpoint: 'http://localhost:8000',
    });

    this.client = DynamoDBDocumentClient.from(client, {
      marshallOptions: {
        removeUndefinedValues: true,
        convertEmptyValues: false,
      },
    });
  }

  get() {
    return this.client;
  }
}
