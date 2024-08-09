import * as ddb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';

type DBStackProps = {
  lambda: lambda.Function;
} & cdk.StackProps;

export class DBStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: DBStackProps) {
    super(scope, id, props);
    const usersTable = new ddb.Table(this, 'CDKUsersTable', {
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      tableName: process.env.USERS_TABLE_NAME,
      partitionKey: {
        name: 'id',
        type: ddb.AttributeType.STRING,
      },
    });

    usersTable.grantFullAccess(props.lambda);

    props.lambda.addEnvironment('USERS_TABLE_NAME', usersTable.tableName);
  }
}
