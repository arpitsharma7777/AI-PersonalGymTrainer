#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { AiFitnessStack } from "../lib/ai-fitness-stack";

const app = new cdk.App();

new AiFitnessStack(app, "AiFitnessStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || "us-east-1",
  },
  description: "AI Personal Gym Trainer - Serverless Backend with Bedrock",
});
