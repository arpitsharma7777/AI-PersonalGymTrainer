import type { WorkoutInsights } from "@/store";

const API_URL = import.meta.env.VITE_API_URL || "";

export interface CompleteSessionPayload {
  userId?: string;
  exercise: string;
  totalReps: number;
  averageScore: number;
  errorCounts: Record<string, number>;
  repScores: number[];
  sessionStartTime: number;
}

export interface CompleteSessionResponse {
  sessionId: string;
  userId: string;
  insights: WorkoutInsights;
}

export async function completeSession(
  data: CompleteSessionPayload
): Promise<CompleteSessionResponse> {
  const res = await fetch(`${API_URL}/sessions/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}

export async function getSessionHistory(userId: string, limit = 10) {
  const res = await fetch(
    `${API_URL}/sessions/${encodeURIComponent(userId)}/history?limit=${limit}`
  );

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}
