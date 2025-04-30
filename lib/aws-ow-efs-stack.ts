import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AwsOwEfsStackProps } from './AwsOwEfsStackProps';

export class AwsOwEfsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AwsOwEfsStackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'AwsOwEfsQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
