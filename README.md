# AWS OpenWorkspace EFS Stack

This project creates an Amazon Elastic File System (EFS) using AWS CDK. It sets up an EFS file system in private subnets of a VPC with appropriate security groups and mount targets.

## Prerequisites

- Node.js (v14 or later)
- AWS CDK CLI (`npm install -g aws-cdk`)
- AWS CLI configured with appropriate credentials
- An existing VPC with private subnets

## Environment Variables

The following environment variables must be set in your `.env` file:

```bash
APP_NAME=your-app-name
CDK_DEPLOY_REGION=your-aws-region
ENVIRONMENT=development|staging|production|feature
VPC_SUBNET_TYPE=PRIVATE_ISOLATED|PRIVATE_WITH_EGRESS
VPC_PRIVATE_SUBNET_IDS=subnet-xxx,subnet-yyy
VPC_PRIVATE_SUBNET_AZS=az1,az2
VPC_PRIVATE_SUBNET_ROUTE_TABLE_IDS=rtb-xxx,rtb-yyy
OWNER=your-name
VPC_ID=vpc-xxx
```

## Project Structure

```bash
.
├── bin/                    # CDK app entry point
│   └── aws-ow-efs.ts      # Main CDK app configuration
├── lib/                    # CDK stack definitions
│   ├── aws-ow-efs-stack.ts # EFS stack implementation
│   └── AwsOwEfsStackProps.ts # Stack properties interface
├── utils/                  # Utility functions
│   ├── check-environment-variable.ts
│   ├── apply-tag.ts
│   └── vpc-type-parser.ts
├── .env                    # Environment variables
├── cdk.json               # CDK configuration
├── package.json           # Node.js dependencies
└── README.md              # This documentation
```

## Features

- Creates an EFS file system in specified private subnets
- Configures security groups for EFS access
- Exports the following CloudFormation outputs:
  - EFS File System ARN
  - EFS File System ID
  - EFS Security Group ID
- Applies AWS Solutions best practices checks using cdk-nag
- Automatically applies tags to all resources

## Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure your `.env` file with the required variables
4. Bootstrap your CDK environment (if not already done):

   ```bash
   npx cdk bootstrap
   ```

## Deployment

To deploy the stack:

```bash
npx cdk deploy
```

To see what changes will be made before deploying:

```bash
npx cdk diff
```

## Useful Commands

- `npm run build` - Compile TypeScript to JavaScript
- `npm run watch` - Watch for changes and compile
- `npm run test` - Run unit tests
- `npx cdk deploy` - Deploy the stack to your AWS account
- `npx cdk diff` - Compare deployed stack with current state
- `npx cdk synth` - Emit the synthesized CloudFormation template

## Security

- The EFS file system is created in private subnets
- Security groups are configured to control access
- AWS Solutions best practices are enforced using cdk-nag
- All resources are tagged with environment, project, and owner information

## Cleanup

To delete the stack and all its resources:

```bash
npx cdk destroy
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
