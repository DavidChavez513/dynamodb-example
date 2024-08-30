import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';

export class DynamodbExampleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    
    const exampleTable = new dynamodb.Table(
      this,
      `users`,
      {
        partitionKey: {
          name: 'id',
          type: dynamodb.AttributeType.STRING
        },
        readCapacity: 2,
        writeCapacity: 2
      }
    );

    const userRegister = new lambda.DockerImageFunction(
      this,
      'registerUser',
      {
        memorySize: 128,
        timeout: cdk.Duration.seconds(60),
        code: lambda.DockerImageCode.fromImageAsset(
          path.join(__dirname, "../lambdas/registerUsers")
        ),
        environment: {
          SAMPLE_TABLE: exampleTable.tableName
        }
      }
    );

    const getUsers = new lambda.DockerImageFunction(
      this,
      'registerUser',
      {
        memorySize: 128,
        timeout: cdk.Duration.seconds(60),
        code: lambda.DockerImageCode.fromImageAsset(
          path.join(__dirname, "../lambdas/get_users")
        ),
        environment: {
          SAMPLE_TABLE: exampleTable.tableName
        }
      }
    );


    // Create API Rest from request response process
    const API = new apigateway.RestApi(
      this,
      'ServerlessApi',
      {
        cloudWatchRole: false
      }
    );

    API.root.addMethod('GET', new apigateway.LambdaIntegration(getUsers));
    API.root.addMethod('POST', new apigateway.LambdaIntegration(userRegister));


    new cdk.CfnOutput(
      this,
      "Serverless API Endpoint",
      {
        value: API.url
      }
    )


  }
}
