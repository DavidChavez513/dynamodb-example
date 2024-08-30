#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
import { DynamodbExampleStack } from '../lib/dynamodb-example-stack';

const app = new cdk.App();
const stack = new DynamodbExampleStack(app, 'ExampleStack', {
  env: {
    region: 'us-east-2',
  },
});

cdk.Tags.of(stack).add('env', 'ExampleStack');