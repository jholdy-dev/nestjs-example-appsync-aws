import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import path from 'path';

type Props = {
  instances: {
    lambdaName: string;
    kind: string;
  }[];
} & cdk.StackProps;

export class RestApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: Props) {
    super(scope, id, props);

    console.log({ instances: props.instances });

    const LambdaHandler = new lambda.DockerImageFunction(
      this,
      'LambdaHandler',
      {
        timeout: cdk.Duration.seconds(30),
        functionName: 'LambdaHandler',
        code: lambda.DockerImageCode.fromImageAsset(
          path.join(__dirname, '../../teste_localstack/'),
        ),
      },
    );

    const api = new apigateway.LambdaRestApi(this, 'HelloApi', {
      handler: LambdaHandler,
    });

    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url ?? 'Something went wrong with the deploy',
    });
  }
}
