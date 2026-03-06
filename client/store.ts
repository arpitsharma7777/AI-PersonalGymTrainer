import { create } from "zustand";

export type AppState = "IDLE" | "CALIBRATING" | "WORKOUT" | "SUMMARY";
export type ExerciseType = "SQUAT" | "PUSHUP" | "JUMPING_JACK";

export interface CameraChecks {
    isBodyVisible: boolean;
    isCentered: boolean;
    isDistanceCorrect: boolean;
    isLevel: boolean;
}

export interface RepRecord {
    timestamp: number;
    scoreAdjustment: number;
    feedback: string;
}

export interface WorkoutInsights {
    summary: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    progressNote: string;
}

interface HackfinityState {
    // Application Flow
    appState: AppState;
    setAppState: (state: AppState) => void;

    // Exercise Selection
    selectedExercise: ExerciseType;
    setSelectedExercise: (exercise: ExerciseType) => void;

    // Workout Data
    repCount: number;
    qualityScore: number;
    feedbackMessage: string;
    sessionStartTime: number;
    repHistory: RepRecord[];
    errorCounts: Record<string, number>;
    setRepCount: (count: number) => void;
    incrementRepCount: () => void;
    updateQualityScore: (change: number) => void;
    setFeedbackMessage: (message: string) => void;
    recordRep: (rep: { scoreAdjustment: number; feedback: string }) => void;
    incrementError: (errorType: string) => void;
    startSession: () => void;
    resetWorkout: () => void;

    // AI Insights
    aiInsights: WorkoutInsights | null;
    isLoadingInsights: boolean;
    setAiInsights: (insights: WorkoutInsights | null) => void;
    setLoadingInsights: (loading: boolean) => void;

    // Camera Status
    cameraChecks: CameraChecks;
    setCameraChecks: (checks: Partial<CameraChecks>) => void;
}

export const useHackfinityStore = create<HackfinityState>((set) => ({
    // Initial Flow State
    appState: "IDLE",
    setAppState: (state) => set({ appState: state }),

    // Initial Exercise
    selectedExercise: "SQUAT",
    setSelectedExercise: (exercise) => set({ selectedExercise: exercise }),

    // Initial Workout Data
    repCount: 0,
    qualityScore: 100,
    feedbackMessage: "Waiting for camera...",
    sessionStartTime: 0,
    repHistory: [],
    errorCounts: {},
    setRepCount: (count) => set({ repCount: count }),
    incrementRepCount: () => set((state) => ({ repCount: state.repCount + 1 })),
    updateQualityScore: (change) =>
        set((state) => ({
            qualityScore: Math.min(100, Math.max(0, state.qualityScore + change)),
        })),
    setFeedbackMessage: (message) => set({ feedbackMessage: message }),
    recordRep: (rep) =>
        set((state) => ({
            repHistory: [
                ...state.repHistory,
                { ...rep, timestamp: Date.now() },
            ],
        })),
    incrementError: (errorType) =>
        set((state) => ({
            errorCounts: {
                ...state.errorCounts,
                [errorType]: (state.errorCounts[errorType] || 0) + 1,
            },
        })),
    startSession: () =>
        set({
            sessionStartTime: Date.now(),
            repHistory: [],
            errorCounts: {},
            aiInsights: null,
            isLoadingInsights: false,
        }),
    resetWorkout: () =>
        set({
            repCount: 0,
            qualityScore: 100,
            feedbackMessage: "Get Ready!",
            appState: "CALIBRATING",
            sessionStartTime: 0,
            repHistory: [],
            errorCounts: {},
            aiInsights: null,
            isLoadingInsights: false,
            cameraChecks: {
                isBodyVisible: false,
                isCentered: false,
                isDistanceCorrect: false,
                isLevel: false,
            }
        }),

    // AI Insights
    aiInsights: null,
    isLoadingInsights: false,
    setAiInsights: (insights) => set({ aiInsights: insights }),
    setLoadingInsights: (loading) => set({ isLoadingInsights: loading }),

    // Initial Camera Checks
    cameraChecks: {
        isBodyVisible: false,
        isCentered: false,
        isDistanceCorrect: false,
        isLevel: false,
    },
    setCameraChecks: (checks) =>
        set((state) => ({
            cameraChecks: { ...state.cameraChecks, ...checks },
        })),
}));
