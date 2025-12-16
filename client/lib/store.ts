import { create } from "zustand";

export interface WorkoutSession {
  currentReps: number;
  repQualityScore: number;
  totalSets: number;
  currentSet: number;
  repQualityHistory: number[];
  isActive: boolean;
  lastFeedback: string;
}

interface WorkoutStore {
  session: WorkoutSession;
  startWorkout: () => void;
  stopWorkout: () => void;
  incrementRep: () => void;
  setRepQualityScore: (score: number) => void;
  setFeedback: (feedback: string) => void;
  completeSession: () => void;
  resetSession: () => void;
}

const initialSession: WorkoutSession = {
  currentReps: 0,
  repQualityScore: 0,
  totalSets: 3,
  currentSet: 1,
  repQualityHistory: [],
  isActive: false,
  lastFeedback: "",
};

export const useWorkoutStore = create<WorkoutStore>((set) => ({
  session: initialSession,

  startWorkout: () =>
    set((state) => ({
      session: {
        ...state.session,
        isActive: true,
      },
    })),

  stopWorkout: () =>
    set((state) => ({
      session: {
        ...state.session,
        isActive: false,
      },
    })),

  incrementRep: () =>
    set((state) => ({
      session: {
        ...state.session,
        currentReps: state.session.currentReps + 1,
      },
    })),

  setRepQualityScore: (score: number) =>
    set((state) => ({
      session: {
        ...state.session,
        repQualityScore: score,
        repQualityHistory: [...state.session.repQualityHistory, score],
      },
    })),

  setFeedback: (feedback: string) =>
    set((state) => ({
      session: {
        ...state.session,
        lastFeedback: feedback,
      },
    })),

  completeSession: () =>
    set((state) => ({
      session: {
        ...state.session,
        isActive: false,
      },
    })),

  resetSession: () =>
    set(() => ({
      session: initialSession,
    })),
}));
