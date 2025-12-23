import { useEffect, useRef, useState } from "react";
import {
    PoseLandmarker,
    FilesetResolver,
    DrawingUtils,
    PoseLandmarkerResult,
} from "@mediapipe/tasks-vision";

export const useMediaPipe = () => {
    const [landmarker, setLandmarker] = useState<PoseLandmarker | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const createPoseLandmarker = async () => {
            try {
                const vision = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
                );
                const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath:
                            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task",
                        delegate: "GPU",
                    },
                    runningMode: "VIDEO",
                    numPoses: 1,
                });
                setLandmarker(poseLandmarker);
                setIsLoading(false);
            } catch (error) {
                console.error("Error creating PoseLandmarker:", error);
                setIsLoading(false);
            }
        };

        createPoseLandmarker();
    }, []);

    return { landmarker, isLoading };
};
