export interface SessionCompleteRequest {
  userId?: string;
  exercise: string;
  totalReps: number;
  averageScore: number;
  errorCounts: Record<string, number>;
  repScores: number[];
  sessionStartTime: number;
}

export interface WorkoutInsights {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  progressNote: string;
}

export interface SessionCompleteResponse {
  sessionId: string;
  insights: WorkoutInsights;
}

export interface SessionRecord {
  userId: string;
  sessionDate: number;
  sessionId: string;
  exercise: string;
  totalReps: number;
  averageScore: number;
  errorCounts: Record<string, number>;
  repScores: number[];
  insights?: WorkoutInsights;
  ttl: number;
}

export function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Amz-Date,X-Api-Key",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    "Content-Type": "application/json",
  };
}

export function errorResponse(statusCode: number, message: string) {
  return {
    statusCode,
    headers: corsHeaders(),
    body: JSON.stringify({ error: message }),
  };
}

export function successResponse(body: unknown) {
  return {
    statusCode: 200,
    headers: corsHeaders(),
    body: JSON.stringify(body),
  };
}
