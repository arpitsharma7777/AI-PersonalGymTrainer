import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { WorkoutInsights } from "./types";

const client = new BedrockRuntimeClient({
  region: process.env.BEDROCK_REGION || "us-east-1",
});

function buildPrompt(
  exercise: string,
  totalReps: number,
  averageScore: number,
  errorCounts: Record<string, number>,
  repScores: number[]
): string {
  const errorSummary = Object.entries(errorCounts)
    .map(([type, count]) => `${type.replace(/_/g, " ")}: ${count} times`)
    .join(", ") || "None detected";

  return `You are an expert fitness coach analyzing a workout session. Provide constructive, encouraging feedback.

Session Data:
- Exercise: ${exercise}
- Total Reps: ${totalReps}
- Average Quality Score: ${averageScore}/100
- Common Errors: ${errorSummary}
- Per-Rep Scores (adjustments): ${repScores.join(", ")}

Generate your analysis in this exact JSON format (no markdown, just raw JSON):
{
  "summary": "Brief 2-3 sentence overview of the workout performance",
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "recommendations": ["specific actionable recommendation 1", "recommendation 2", "recommendation 3"],
  "progressNote": "Motivational note about progress and next steps"
}

Focus on:
1. Specific posture corrections based on the error patterns
2. Positive reinforcement for good form
3. Practical tips the user can apply in their next session
4. Keep language simple, friendly, and motivating`;
}

export async function generateInsights(
  exercise: string,
  totalReps: number,
  averageScore: number,
  errorCounts: Record<string, number>,
  repScores: number[]
): Promise<WorkoutInsights> {
  const modelId = process.env.BEDROCK_MODEL_ID || "amazon.nova-pro-v1:0";

  try {
    const prompt = buildPrompt(exercise, totalReps, averageScore, errorCounts, repScores);

    const command = new InvokeModelCommand({
      modelId,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        inferenceConfig: {
          maxTokens: 500,
          temperature: 0.7,
          topP: 0.9,
        },
        messages: [
          {
            role: "user",
            content: [{ text: prompt }],
          },
        ],
      }),
    });

    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const text = responseBody.output?.message?.content?.[0]?.text || "";

    // Extract JSON from the response (handle potential markdown wrapping)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn("Bedrock response did not contain valid JSON, using fallback");
      return generateFallbackInsights(exercise, totalReps, averageScore, errorCounts);
    }

    const insights: WorkoutInsights = JSON.parse(jsonMatch[0]);

    // Validate required fields exist
    if (!insights.summary || !insights.strengths || !insights.recommendations) {
      return generateFallbackInsights(exercise, totalReps, averageScore, errorCounts);
    }

    return insights;
  } catch (error) {
    console.error("Bedrock invocation failed:", error);
    return generateFallbackInsights(exercise, totalReps, averageScore, errorCounts);
  }
}

function generateFallbackInsights(
  exercise: string,
  totalReps: number,
  averageScore: number,
  errorCounts: Record<string, number>
): WorkoutInsights {
  const exerciseName = exercise.replace(/_/g, " ").toLowerCase();
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const recommendations: string[] = [];

  if (averageScore >= 80) {
    strengths.push(`Excellent form maintained throughout your ${exerciseName} session`);
    strengths.push("Consistent quality across reps");
  } else if (averageScore >= 60) {
    strengths.push(`Good effort on your ${exerciseName} session`);
    weaknesses.push("Form quality could be more consistent");
  } else {
    strengths.push(`Completed ${totalReps} reps - showing dedication`);
    weaknesses.push("Form quality needs significant improvement");
  }

  if (totalReps >= 10) {
    strengths.push("Great endurance - solid rep count");
  }

  // Error-specific feedback
  const topErrors = Object.entries(errorCounts).sort((a, b) => b[1] - a[1]);
  for (const [errorType] of topErrors.slice(0, 2)) {
    const normalized = errorType.replace(/_/g, " ").toLowerCase();
    weaknesses.push(`Recurring issue: ${normalized}`);
    if (errorType.includes("deep")) {
      recommendations.push("Focus on controlled depth - aim for thighs parallel to the ground");
    } else if (errorType.includes("low") || errorType.includes("shallow")) {
      recommendations.push("Try to increase your range of motion gradually");
    } else {
      recommendations.push(`Work on correcting ${normalized} in your next session`);
    }
  }

  recommendations.push("Warm up properly before your next session");
  if (recommendations.length < 3) {
    recommendations.push("Consider recording yourself to visually check form");
  }

  return {
    summary: `You completed ${totalReps} ${exerciseName} reps with an average form quality of ${averageScore}%. ${averageScore >= 70 ? "Solid workout!" : "Keep practicing to improve your form."}`,
    strengths,
    weaknesses: weaknesses.length > 0 ? weaknesses : ["Keep challenging yourself with more reps"],
    recommendations,
    progressNote: averageScore >= 80
      ? "You're performing at a high level. Try increasing difficulty or adding more reps to keep progressing."
      : "Every session makes you stronger. Focus on the form corrections above and you'll see improvement quickly.",
  };
}
