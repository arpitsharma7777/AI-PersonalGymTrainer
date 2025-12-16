import { useState, useCallback } from "react";

export interface Coordinate {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

export interface SkeletonData {
  landmarks: Coordinate[];
  posture: "good" | "bad" | "neutral";
  confidence: number;
}

export const useMediaPipeMock = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [skeletonData, setSkeletonData] = useState<SkeletonData | null>(null);

  const getMockGoodPosture = useCallback((): Coordinate[] => {
    return [
      { x: 0.5, y: 0.2, z: 0, visibility: 1 },
      { x: 0.5, y: 0.3, z: 0, visibility: 1 },
      { x: 0.35, y: 0.4, z: 0, visibility: 1 },
      { x: 0.65, y: 0.4, z: 0, visibility: 1 },
      { x: 0.3, y: 0.55, z: 0, visibility: 1 },
      { x: 0.7, y: 0.55, z: 0, visibility: 1 },
      { x: 0.3, y: 0.8, z: 0, visibility: 1 },
      { x: 0.7, y: 0.8, z: 0, visibility: 1 },
      { x: 0.35, y: 0.95, z: 0, visibility: 1 },
      { x: 0.65, y: 0.95, z: 0, visibility: 1 },
      { x: 0.25, y: 0.4, z: 0, visibility: 1 },
      { x: 0.75, y: 0.4, z: 0, visibility: 1 },
      { x: 0.2, y: 0.5, z: 0, visibility: 1 },
      { x: 0.8, y: 0.5, z: 0, visibility: 1 },
    ];
  }, []);

  const getMockBadPosture = useCallback((): Coordinate[] => {
    return [
      { x: 0.55, y: 0.25, z: 0, visibility: 1 },
      { x: 0.55, y: 0.35, z: 0, visibility: 1 },
      { x: 0.35, y: 0.45, z: 0, visibility: 1 },
      { x: 0.65, y: 0.45, z: 0, visibility: 1 },
      { x: 0.25, y: 0.6, z: 0, visibility: 1 },
      { x: 0.75, y: 0.5, z: 0, visibility: 1 },
      { x: 0.2, y: 0.85, z: 0, visibility: 1 },
      { x: 0.8, y: 0.8, z: 0, visibility: 1 },
      { x: 0.25, y: 0.98, z: 0, visibility: 1 },
      { x: 0.75, y: 0.95, z: 0, visibility: 1 },
      { x: 0.2, y: 0.45, z: 0, visibility: 1 },
      { x: 0.8, y: 0.4, z: 0, visibility: 1 },
      { x: 0.15, y: 0.55, z: 0, visibility: 1 },
      { x: 0.85, y: 0.5, z: 0, visibility: 1 },
    ];
  }, []);

  const simulateGoodPosture = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setSkeletonData({
        landmarks: getMockGoodPosture(),
        posture: "good",
        confidence: 0.95,
      });
      setIsLoading(false);
    }, 500);
  }, [getMockGoodPosture]);

  const simulateBadPosture = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setSkeletonData({
        landmarks: getMockBadPosture(),
        posture: "bad",
        confidence: 0.88,
      });
      setIsLoading(false);
    }, 500);
  }, [getMockBadPosture]);

  const simulateNeutralPosture = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setSkeletonData({
        landmarks: getMockGoodPosture(),
        posture: "neutral",
        confidence: 0.92,
      });
      setIsLoading(false);
    }, 500);
  }, [getMockGoodPosture]);

  return {
    skeletonData,
    isLoading,
    simulateGoodPosture,
    simulateBadPosture,
    simulateNeutralPosture,
    getMockGoodPosture,
    getMockBadPosture,
  };
};
