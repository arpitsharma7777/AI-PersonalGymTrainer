"use client";

import { useEffect, useRef, useState } from "react";
import { useMediaPipe } from "@/hooks/use-media-pipe";
import { useHackfinityStore } from "@/store";
import { analyzeCalibration, analyzeSquat, analyzePushup, analyzeJumpingJack, SquatState } from "@/logic/pose-analysis";
import {
    DrawingUtils,
    PoseLandmarker,
    PoseLandmarkerResult,
} from "@mediapipe/tasks-vision";

export function CameraFeed() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { landmarker, isLoading } = useMediaPipe();
    const [isVideoReady, setIsVideoReady] = useState(false);
    const requestRef = useRef<number>(0);

    // Global State
    const {
        appState,
        setFeedbackMessage,
        setCameraChecks,
        incrementRepCount,
        updateQualityScore,
        recordRep,
        incrementError,
        qualityScore,
        repCount,
        feedbackMessage
    } = useHackfinityStore();

    // Local State for Squat Analysis Logic (persistent across frames)
    const squatState = useRef<SquatState>({ stage: "UP", minAngle: 180 });

    // ── Audio feedback refs ──────────────────────────────────────────
    const lastSpokenRef      = useRef<string>("");
    const speechCooldownRef  = useRef<number>(0);

    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 1280, height: 720 },
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.addEventListener("loadeddata", () => {
                        setIsVideoReady(true);
                    });
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
                setFeedbackMessage("Camera access denied or unavailable.");
            }
        };

        startCamera();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach((track) => track.stop());
            }
            // Cancel any pending speech when camera stops
            if ("speechSynthesis" in window) window.speechSynthesis.cancel();
        };
    }, []);

    // ── Audio feedback (workout only) ────────────────────────────────
    useEffect(() => {
        if (appState !== "WORKOUT" || !feedbackMessage) return;
        if (feedbackMessage === lastSpokenRef.current) return;

        const now = Date.now();
        if (now - speechCooldownRef.current < 2500) return; // 2.5s cooldown

        lastSpokenRef.current     = feedbackMessage;
        speechCooldownRef.current = now;

        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            const utterance   = new SpeechSynthesisUtterance(feedbackMessage);
            utterance.rate    = 1.1;
            utterance.pitch   = 1;
            utterance.volume  = 1;
            window.speechSynthesis.speak(utterance);
        }
    }, [feedbackMessage, appState]);

    useEffect(() => {
        if (!landmarker || !isVideoReady || !videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const drawingUtils = new DrawingUtils(ctx);

        const predictWebcam = async () => {
            // Resize canvas to match video
            if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
            }

            let startTimeMs = performance.now();
            let result: PoseLandmarkerResult | null = null;

            try {
                result = landmarker.detectForVideo(video, startTimeMs);
            } catch (e) {
                console.error(e);
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (result && result.landmarks && result.landmarks.length > 0) {
                const landmarks = result.landmarks[0];

                // Draw landmarks
                drawingUtils.drawLandmarks(landmarks, {
                    radius: (data) => DrawingUtils.lerp(data.from!.z, -0.15, 0.1, 5, 1),
                    color: "#00ff64",
                    lineWidth: 2,
                });
                drawingUtils.drawConnectors(landmarks, PoseLandmarker.POSE_CONNECTIONS, {
                    color: "#FFFFFF",
                    lineWidth: 2
                });

                // --- CORE LOGIC SWITCH ---
                if (appState === 'CALIBRATING' || appState === 'IDLE') {
                    const analysis = analyzeCalibration(landmarks);
                    if (feedbackMessage !== analysis.feedback) {
                        setFeedbackMessage(analysis.feedback);
                    }
                    setCameraChecks(analysis.checks);
                }
                else if (appState === 'WORKOUT') {
                    const selectedExercise = useHackfinityStore.getState().selectedExercise;
                    let result;

                    if (selectedExercise === 'SQUAT') {
                        result = analyzeSquat(landmarks, squatState.current);
                        squatState.current = { stage: result.stage as "UP" | "DOWN", minAngle: result.minAngle };
                    } else if (selectedExercise === 'PUSHUP') {
                        // Re-use squatState structure or add new ref for pushup if needed unique state
                        // For simplicity, casting to any, ideally we have separate refs or a unified "exerciseState" ref
                        // But since we persist simple stage/minAngle, we can share or reset on start.
                        // Let's assume user reset workout when switching, so state is fresh.
                        result = analyzePushup(landmarks, squatState.current as any);
                        squatState.current = { stage: result.stage as "UP" | "DOWN", minAngle: result.minAngle };
                    } else if (selectedExercise === 'JUMPING_JACK') {
                        result = analyzeJumpingJack(landmarks, squatState.current as any);
                        squatState.current = { stage: result.stage as "UP" | "DOWN", minAngle: 0 };
                    }

                    if (result && result.feedback && result.feedback !== feedbackMessage) {
                        setFeedbackMessage(result.feedback);
                    }

                    if (result && result.didRep) {
                        incrementRepCount();
                        recordRep({
                            scoreAdjustment: result.scoreAdjustment,
                            feedback: result.feedback,
                        });
                        if (result.scoreAdjustment !== 0) {
                            updateQualityScore(result.scoreAdjustment);
                        }
                        if (result.scoreAdjustment < 0) {
                            const errorType = result.feedback.toLowerCase().replace(/[^a-z ]/g, '').trim().replace(/ +/g, '_');
                            incrementError(errorType);
                        }
                    }
                }
            } else {
                if (feedbackMessage !== "Please stand in front of the camera") {
                    setFeedbackMessage("Please stand in front of the camera");
                }
            }

            requestRef.current = requestAnimationFrame(predictWebcam);
        };

        predictWebcam();

        return () => {
            cancelAnimationFrame(requestRef.current);
        };
    }, [landmarker, isVideoReady, appState, feedbackMessage]);

    return (
        <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute top-0 left-0 w-full h-full object-cover transform -scale-x-100"
            />
            <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full object-cover transform -scale-x-100 pointer-events-none"
            />

            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20 backdrop-blur-sm">
                    <div className="text-center space-y-6">
                        <div className="w-20 h-20 border-4 border-primary rounded-full animate-spin border-t-transparent mx-auto shadow-[0_0_20px_rgba(23,231,119,0.5)]" />
                        <p className="text-white font-heading text-xl tracking-wider uppercase">Loading Neural Network...</p>
                    </div>
                </div>
            )}

            {/* HUD: Stats Panel (Top Left) */}
            {appState === 'WORKOUT' && (
                <div className="absolute top-6 left-6 z-10 flex gap-4">
                    <div className="bg-black/60 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/5 shadow-lg">
                        <p className="text-xs text-white/50 uppercase tracking-widest font-semibold mb-1">Reps</p>
                        <p className="text-5xl font-heading font-bold text-white transition-all duration-300">{repCount}</p>
                    </div>

                    <div className="bg-black/60 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/5 shadow-lg">
                        <p className="text-xs text-white/50 uppercase tracking-widest font-semibold mb-1">Form</p>
                        <p className={`text-5xl font-heading font-bold transition-colors duration-300 ${qualityScore > 80 ? 'text-primary' : 'text-yellow-400'}`}>
                            {qualityScore}%
                        </p>
                    </div>
                </div>
            )}

            {/* HUD: Feedback Toast (Bottom Center) - Always Visible */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-md px-4">
                <div className={`
                    bg-black/70 backdrop-blur-lg px-8 py-4 rounded-full border border-white/10 shadow-xl text-center transition-all duration-300
                    ${feedbackMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                 `}>
                    <p className="text-lg font-medium text-white tracking-wide">
                        {feedbackMessage || "Ready"}
                    </p>
                </div>
            </div>

            {/* HUD: Calibration Indicator (If not workout) */}
            {appState !== 'WORKOUT' && (
                <div className="absolute top-6 left-6 z-10 bg-primary/20 backdrop-blur-md px-4 py-2 rounded-full border border-primary/30">
                    <p className="text-xs font-bold text-primary uppercase tracking-widest animate-pulse">
                        System Calibrating
                    </p>
                </div>
            )}
        </div>
    );
}
