import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";
import { generateInsights } from "./shared/bedrock-client";
import {
  SessionCompleteRequest,
  SessionRecord,
  corsHeaders,
  errorResponse,
  successResponse,
} from "./shared/types";

const ddbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddbClient);
const TABLE_NAME = process.env.SESSIONS_TABLE!;

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders(), body: "" };
  }

  try {
    if (!event.body) {
      return errorResponse(400, "Request body is required");
    }

    const request: SessionCompleteRequest = JSON.parse(event.body);

    // Validate required fields
    if (!request.exercise || request.totalReps === undefined || request.averageScore === undefined) {
      return errorResponse(400, "Missing required fields: exercise, totalReps, averageScore");
    }

    const sessionId = randomUUID();
    const userId = request.userId || `anon-${randomUUID().slice(0, 8)}`;
    const sessionDate = Date.now();
    const ttl = Math.floor(sessionDate / 1000) + 365 * 24 * 60 * 60; // 1 year

    // Generate AI insights via Bedrock
    const insights = await generateInsights(
      request.exercise,
      request.totalReps,
      request.averageScore,
      request.errorCounts || {},
      request.repScores || []
    );

    // Store session in DynamoDB
    const sessionRecord: SessionRecord = {
      userId,
      sessionDate,
      sessionId,
      exercise: request.exercise,
      totalReps: request.totalReps,
      averageScore: request.averageScore,
      errorCounts: request.errorCounts || {},
      repScores: request.repScores || [],
      insights,
      ttl,
    };

    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: sessionRecord,
      })
    );

    return successResponse({
      sessionId,
      userId,
      insights,
    });
  } catch (error) {
    console.error("Error processing session:", error);
    return errorResponse(500, "Internal server error");
  }
}
