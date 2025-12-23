import { create } from "zustand";

export type AppState = "IDLE" | "CALIBRATING" | "WORKOUT" | "SUMMARY";
export type ExerciseType = "SQUAT" | "PUSHUP" | "JUMPING_JACK";

export interface CameraChecks {
    isBodyVisible: boolean;
    isCentered: boolean;
    isDistanceCorrect: boolean;
    isLevel: boolean;
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
    setRepCount: (count: number) => void;
    incrementRepCount: () => void;
    updateQualityScore: (change: number) => void;
    setFeedbackMessage: (message: string) => void;
    resetWorkout: () => void;

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
    setRepCount: (count) => set({ repCount: count }),
    incrementRepCount: () => set((state) => ({ repCount: state.repCount + 1 })),
    updateQualityScore: (change) =>
        set((state) => ({
            qualityScore: Math.min(100, Math.max(0, state.qualityScore + change)),
        })),
    setFeedbackMessage: (message) => set({ feedbackMessage: message }),
    resetWorkout: () =>
        set({
            repCount: 0,
            qualityScore: 100,
            feedbackMessage: "Get Ready!",
            appState: "CALIBRATING",
            cameraChecks: {
                isBodyVisible: false,
                isCentered: false,
                isDistanceCorrect: false,
                isLevel: false,
            }
        }),

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
