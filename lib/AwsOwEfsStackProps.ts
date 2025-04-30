import { StackProps } from "aws-cdk-lib";

export interface AwsOwEfsStackProps extends StackProps {
     /** Resource prefix for all AWS resources */
     readonly resourcePrefix: string;
     /** AWS region where resources will be deployed */
     readonly deployRegion: string | undefined;
     /** Deployment environment (e.g., development, staging, production) */
     readonly deployEnvironment: string;
     /** Name of the application */
     readonly appName: string;
     /**
      * Owner or team responsible for the resources
      */
     readonly owner: string;
     /** VPC ID */
     readonly vpcId: string;
     /** VPC subnet type */
     readonly vpcSubnetType: string;
     /** VPC private subnet IDs */
     readonly vpcPrivateSubnetIds: string[];
     /** VPC private subnet AZs */
     readonly vpcPrivateSubnetAzs: string[];
     /** VPC private subnet route table IDs */
     readonly vpcPrivateSubnetRouteTableIds: string[];
}
