#!/usr/bin/env node
import 'source-map-support/register';

import * as cdk from 'aws-cdk-lib';
import * as dotenv from 'dotenv';
import { checkEnvVariables } from '../utils/check-environment-variable';
import { ApplyTags } from '../utils/apply-tag';
import { Aspects } from 'aws-cdk-lib';
import { AwsSolutionsChecks } from 'cdk-nag';
import { AwsOwEfsStackProps } from '../lib/AwsOwEfsStackProps';
import { AwsOwEfsStack } from '../lib/aws-ow-efs-stack';

dotenv.config(); // Load environment variables from .env file
const app = new cdk.App();

const appAspects = Aspects.of(app);

// check APP_NAME variable
checkEnvVariables('APP_NAME',
    'CDK_DEPLOY_REGION',
    'ENVIRONMENT',
    'VPC_SUBNET_TYPE',
    'VPC_PRIVATE_SUBNET_IDS',
    'VPC_PRIVATE_SUBNET_AZS',
    'VPC_PRIVATE_SUBNET_ROUTE_TABLE_IDS',
    'OWNER',
    'VPC_ID',
    'EFS_NAMES',
);

const { CDK_DEFAULT_ACCOUNT: account } = process.env;

const cdkRegion = process.env.CDK_DEPLOY_REGION;
const deployEnvironment = process.env.ENVIRONMENT!;

const appName = process.env.APP_NAME!;
const owner = process.env.OWNER!;

// check best practices based on AWS Solutions Security Matrix
appAspects.add(new AwsSolutionsChecks());

appAspects.add(new ApplyTags({
    environment: deployEnvironment as 'development' | 'staging' | 'production' | 'feature',
    project: appName,
    owner: owner,
}));

const awsOwEfsStackProps: AwsOwEfsStackProps = {
    resourcePrefix: `${appName}-${deployEnvironment}`,
    env: {
        region: cdkRegion,
        account,
    },
    deployRegion: cdkRegion,
    deployEnvironment,
    appName,
    vpcSubnetType: process.env.VPC_SUBNET_TYPE!,
    owner,
    vpcId: process.env.VPC_ID!,
    vpcPrivateSubnetIds: process.env.VPC_PRIVATE_SUBNET_IDS!.split(','),
    vpcPrivateSubnetAzs: process.env.VPC_PRIVATE_SUBNET_AZS!.split(','),
    vpcPrivateSubnetRouteTableIds: process.env.VPC_PRIVATE_SUBNET_ROUTE_TABLE_IDS!.split(','),
    efsNames: process.env.EFS_NAMES!.split(','),
};
new AwsOwEfsStack(app, `${owner}-${deployEnvironment}-AwsOwEfsStack`, {
    ...awsOwEfsStackProps,
    stackName: `${owner}-${deployEnvironment}-AwsOwEfsStack`,
    description: `AwsOwEfsStack for ${appName} in ${cdkRegion} ${deployEnvironment}.`,
});

app.synth();
