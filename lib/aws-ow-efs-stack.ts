import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { AwsOwEfsStackProps } from './AwsOwEfsStackProps';
import { parseVpcSubnetType } from '../utils/vpc-type-parser';
import { FileSystem } from 'aws-cdk-lib/aws-efs';

/**
 * AWS OpenWorkspace EFS Stack
 *
 * This stack creates an Amazon Elastic File System (EFS) in private subnets of a VPC.
 * It includes:
 * - EFS file system with appropriate security groups
 * - CloudFormation outputs for EFS ARN, ID, and security group ID
 * - AWS Solutions best practices checks
 * - Resource tagging
 *
 * @example
 * ```typescript
 * const stack = new AwsOwEfsStack(app, 'MyEfsStack', {
 *   resourcePrefix: 'my-app-dev',
 *   env: { region: 'us-west-2' },
 *   vpcId: 'vpc-123456',
 *   vpcSubnetType: 'PRIVATE_ISOLATED',
 *   vpcPrivateSubnetIds: ['subnet-123456', 'subnet-789012'],
 *   vpcPrivateSubnetAzs: ['us-west-2a', 'us-west-2b'],
 *   vpcPrivateSubnetRouteTableIds: ['rtb-123456', 'rtb-789012']
 * });
 * ```
 */
export class AwsOwEfsStack extends cdk.Stack {
  /**
   * Creates a new AwsOwEfsStack
   *
   * @param scope - The parent construct
   * @param id - The construct ID
   * @param props - Stack properties including VPC and subnet configurations
   */
  constructor(scope: Construct, id: string, props: AwsOwEfsStackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromLookup(this, `${props.resourcePrefix}-VPC-Imported`, {
      vpcId: props.vpcId,
    });
    const vpcSubnetType = parseVpcSubnetType(props.vpcSubnetType);

    // define subnetAttributes as an array of Record<string, string> with subnetId comes from props.vpcPrivateSubnetIds and availabilityZone comes from props.vpcPrivateSubnetAzs
    const subnetAttributes: Record<string, string>[] = props.vpcPrivateSubnetIds.map((subnetId, index) => {
      return {
        subnetId: subnetId,
        availabilityZone: props.vpcPrivateSubnetAzs[index],
        routeTableId: props.vpcPrivateSubnetRouteTableIds[index],
        type: vpcSubnetType,
      };
    });
    console.log('subnetAttributes:', JSON.stringify(subnetAttributes));

    // retrieve subnets from vpc
    const vpcPrivateISubnets: cdk.aws_ec2.ISubnet[] = subnetAttributes.map((subnetAttribute) => {
      return ec2.Subnet.fromSubnetAttributes(this, subnetAttribute.subnetId, {
        subnetId: subnetAttribute.subnetId,
        availabilityZone: subnetAttribute.availabilityZone,
        routeTableId: subnetAttribute.routeTableId,
      });
    });

    // Create security group for EFS
    const efsSecurityGroup = new ec2.SecurityGroup(this, `${props.resourcePrefix}-EFS-Security-Group`, {
      vpc,
      allowAllOutbound: true,
      description: 'Security group for EFS',
    });
    efsSecurityGroup.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

    // Create EFS file system
    const efsFileSystem = new FileSystem(this, `${props.resourcePrefix}-EFS-FileSystem`, {
      vpc,
      vpcSubnets: {
        subnets: vpcPrivateISubnets,
        subnetType: vpcSubnetType,
        availabilityZones: props.vpcPrivateSubnetAzs,
      },
      securityGroup: efsSecurityGroup,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // export efsFileSystem
    new cdk.CfnOutput(this, `${props.resourcePrefix}-EFS-FileSystem-Arn`, {
      value: efsFileSystem.fileSystemArn,
      exportName: `${props.resourcePrefix}-EFS-FileSystem-Arn`,
      description: `Arn of the EFS file system`,
    });

    new cdk.CfnOutput(this, `${props.resourcePrefix}-EFS-FileSystem-Id`, {
      value: efsFileSystem.fileSystemId,
      exportName: `${props.resourcePrefix}-EFS-FileSystem-Id`,
      description: `Id of the EFS file system`,
    });

    new cdk.CfnOutput(this, `${props.resourcePrefix}-EFS-FileSystem-Security-Group-Id`, {
      value: efsSecurityGroup.securityGroupId,
      exportName: `${props.resourcePrefix}-EFS-FileSystem-Security-Group-Id`,
      description: `Id of the EFS security group`,
    });
  }
}
