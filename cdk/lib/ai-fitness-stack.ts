import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as iam from "aws-cdk-lib/aws-iam";
import * as path from "path";
import { Construct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export class AiFitnessStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ── DynamoDB: Sessions Table ──────────────────────────────────────
    const sessionsTable = new dynamodb.Table(this, "SessionsTable", {
      tableName: "ai-fitness-sessions",
      partitionKey: { name: "userId", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "sessionDate", type: dynamodb.AttributeType.NUMBER },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      timeToLiveAttribute: "ttl",
    });

    sessionsTable.addGlobalSecondaryIndex({
      indexName: "SessionIdIndex",
      partitionKey: {
        name: "sessionId",
        type: dynamodb.AttributeType.STRING,
      },
    });

    // ── Bedrock Model ARN ─────────────────────────────────────────────
    const bedrockModelId = "amazon.nova-pro-v1:0";
    const bedrockModelArn = `arn:aws:bedrock:${this.region}::foundation-model/${bedrockModelId}`;

    // ── Lambda: Session Complete ──────────────────────────────────────
    const sessionCompleteFn = new NodejsFunction(this, "SessionCompleteFn", {
      functionName: "ai-fitness-session-complete",
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "handler",
      entry: path.join(__dirname, "../../backend/src/session-complete.ts"),
      timeout: cdk.Duration.seconds(30),
      memorySize: 1024,
      architecture: lambda.Architecture.ARM_64,
      environment: {
        SESSIONS_TABLE: sessionsTable.tableName,
        BEDROCK_MODEL_ID: bedrockModelId,
        BEDROCK_REGION: this.region,
      },
      bundling: {
        minify: true,
        sourceMap: true,
        target: "es2020",
        externalModules: [
          "@aws-sdk/client-dynamodb",
          "@aws-sdk/lib-dynamodb",
          "@aws-sdk/client-bedrock-runtime",
        ],
      },
    });

    // Grant DynamoDB write access
    sessionsTable.grantWriteData(sessionCompleteFn);

    // Grant Bedrock invoke access
    sessionCompleteFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["bedrock:InvokeModel"],
        resources: [bedrockModelArn],
      })
    );

    // ── Lambda: Session History ───────────────────────────────────────
    const sessionHistoryFn = new NodejsFunction(this, "SessionHistoryFn", {
      functionName: "ai-fitness-session-history",
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "handler",
      entry: path.join(__dirname, "../../backend/src/session-history.ts"),
      timeout: cdk.Duration.seconds(10),
      memorySize: 512,
      architecture: lambda.Architecture.ARM_64,
      environment: {
        SESSIONS_TABLE: sessionsTable.tableName,
      },
      bundling: {
        minify: true,
        sourceMap: true,
        target: "es2020",
        externalModules: [
          "@aws-sdk/client-dynamodb",
          "@aws-sdk/lib-dynamodb",
        ],
      },
    });

    // Grant DynamoDB read access
    sessionsTable.grantReadData(sessionHistoryFn);

    // ── API Gateway ───────────────────────────────────────────────────
    const api = new apigateway.RestApi(this, "AiFitnessApi", {
      restApiName: "AI Fitness API",
      description: "API for AI Personal Gym Trainer",
      deployOptions: {
        stageName: "prod",
        throttlingRateLimit: 100,
        throttlingBurstLimit: 200,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: [
          "Content-Type",
          "Authorization",
          "X-Amz-Date",
          "X-Api-Key",
        ],
      },
    });

    // POST /sessions/complete
    const sessionsResource = api.root.addResource("sessions");
    const completeResource = sessionsResource.addResource("complete");
    completeResource.addMethod(
      "POST",
      new apigateway.LambdaIntegration(sessionCompleteFn, {
        proxy: true,
      })
    );

    // GET /sessions/{userId}/history
    const userResource = sessionsResource.addResource("{userId}");
    const historyResource = userResource.addResource("history");
    historyResource.addMethod(
      "GET",
      new apigateway.LambdaIntegration(sessionHistoryFn, {
        proxy: true,
      })
    );

    // ── Outputs ───────────────────────────────────────────────────────
    new cdk.CfnOutput(this, "ApiUrl", {
      value: api.url,
      description: "API Gateway URL",
      exportName: "AiFitnessApiUrl",
    });

    new cdk.CfnOutput(this, "SessionsTableName", {
      value: sessionsTable.tableName,
      description: "DynamoDB Sessions Table Name",
    });
  }
}
