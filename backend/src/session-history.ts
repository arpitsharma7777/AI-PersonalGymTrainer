import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { corsHeaders, errorResponse, successResponse } from "./shared/types";

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
    const userId = event.pathParameters?.userId;
    if (!userId) {
      return errorResponse(400, "userId is required");
    }

    const limit = parseInt(event.queryStringParameters?.limit || "10", 10);

    const result = await docClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "userId = :uid",
        ExpressionAttributeValues: {
          ":uid": userId,
        },
        ScanIndexForward: false, // newest first
        Limit: Math.min(limit, 50),
      })
    );

    return successResponse({
      sessions: result.Items || [],
      count: result.Count || 0,
    });
  } catch (error) {
    console.error("Error fetching history:", error);
    return errorResponse(500, "Internal server error");
  }
}
