import path from 'path';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import fs from 'fs';
import { LogGroup } from 'aws-cdk-lib/aws-logs';

type Props = {
  instances: {
    lambdaName: string;
    kind: string;
  }[];
  schema: string;
} & cdk.StackProps;

export class AppSyncStack extends cdk.Stack {
  lambda: lambda.Function;
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);

    const tempFileName = `/tmp/${new Date().getTime()}.schema.graphql`;
    fs.writeFileSync(tempFileName, props.schema);

    const definition = appsync.Definition.fromFile(tempFileName);

    const authFunction = new lambda.DockerImageFunction(
      this,
      'LambdaAuthHandler',
      {
        timeout: cdk.Duration.seconds(5),
        memorySize: 256,
        functionName: 'LambdaAuthHandler',
        logGroup: new LogGroup(this, 'LAMBDA_AUTH'),
        code: lambda.DockerImageCode.fromImageAsset(
          path.join(__dirname, '../'),
        ),
      },
    );

    const api = new appsync.GraphqlApi(this, 'app-sync-test-nest', {
      name: 'app-sync-test-nest',
      definition,
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
        },
        additionalAuthorizationModes: [
          {
            authorizationType: appsync.AuthorizationType.LAMBDA,
            lambdaAuthorizerConfig: {
              handler: authFunction,
            },
          },
        ],
      },
    });

    this.lambda = new lambda.DockerImageFunction(this, 'LambdaHandler', {
      timeout: cdk.Duration.seconds(5),
      memorySize: 256,
      functionName: 'LambdaHandler',
      logGroup: new LogGroup(this, 'LAMBDA_TEST'),
      code: lambda.DockerImageCode.fromImageAsset(path.join(__dirname, '../')),
    });

    const lambdaDs = api.addLambdaDataSource('lambdaDatasource', this.lambda);

    for (const instance of props.instances) {
      lambdaDs.createResolver(instance.lambdaName, {
        typeName: instance.kind,
        fieldName: instance.lambdaName,
      });
    }

    new cdk.CfnOutput(this, 'GraphQLAPIID', {
      value: api.apiId,
    });

    new cdk.CfnOutput(this, 'GraphQLAPIURL', {
      value: api.graphqlUrl,
    });

    new cdk.CfnOutput(this, 'GraphQLAPIKey', {
      value: api.apiKey || '',
    });
  }
}
