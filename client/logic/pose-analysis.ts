import { NormalizedLandmark } from "@mediapipe/tasks-vision";

// --- Types ---
export interface CalibrationResult {
    isCalibrated: boolean;
    feedback: string;
    checks: {
        isBodyVisible: boolean;
        isCentered: boolean;
        isDistanceCorrect: boolean;
        isLevel: boolean; // Not strictly defined in prompt but good to have based on store
    };
}

export interface SquatState {
    stage: "UP" | "DOWN";
    minAngle: number; // Track lowest angle in current rep to detect specific squat depth
}

export interface SquatResult {
    stage: "UP" | "DOWN";
    didRep: boolean;
    scoreAdjustment: number; // e.g., -5 for bad form
    feedback: string;
    minAngle: number;
}

// --- Helpers ---

/**
 * Calculates the angle between three points (A, B, C).
 * Ideally using normalized coordinates for 2D projection angle.
 */
function calculateAngle(
    a: NormalizedLandmark,
    b: NormalizedLandmark,
    c: NormalizedLandmark
): number {
    const radians =
        Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs((radians * 180.0) / Math.PI);

    if (angle > 180.0) {
        angle = 360 - angle;
    }

    return angle;
}

// --- Logic ---

/**
 * Requirement 2: The "Camera Coach" Logic
 * Runs every frame during CALIBRATING state.
 */
export function analyzeCalibration(
    landmarks: NormalizedLandmark[]
): CalibrationResult {
    // Landmarks: 0=Nose, 11=Left Shoulder, 12=Right Shoulder, 
    // 23=Left Hip, 24=Right Hip, 27=Left Ankle, 28=Right Ankle

    const nose = landmarks[0];
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    const leftAnkle = landmarks[27];
    const rightAnkle = landmarks[28];

    // 1. Visibility Check (> 0.8)
    // Requirement: Nose, Hips, Ankles
    // Note: MediaPipe visibility is sometimes optimistic, but we follow requirement.
    const isBodyVisible =
        (nose?.visibility ?? 0) > 0.8 &&
        (leftHip?.visibility ?? 0) > 0.8 &&
        (rightHip?.visibility ?? 0) > 0.8 &&
        (leftAnkle?.visibility ?? 0) > 0.8 &&
        (rightAnkle?.visibility ?? 0) > 0.8;

    if (!isBodyVisible) {
        return {
            isCalibrated: false,
            feedback: "Step back! Full body not visible.",
            checks: {
                isBodyVisible: false,
                isCentered: false,
                isDistanceCorrect: false,
                isLevel: false,
            },
        };
    }

    // 2. Centering Check (Nose.x between 0.4 and 0.6)
    const isCentered = nose.x >= 0.4 && nose.x <= 0.6;
    if (!isCentered) {
        const feedback = nose.x < 0.4 ? "Move Left" : "Move Right";
        return {
            isCalibrated: false,
            feedback: feedback,
            checks: {
                isBodyVisible: true,
                isCentered: false,
                isDistanceCorrect: false,
                isLevel: false,
            },
        };
    }

    // 3. Distance Check (Shoulder width >= 15% of frame)
    const shoulderWidth = Math.abs(leftShoulder.x - rightShoulder.x);
    const isDistanceCorrect = shoulderWidth >= 0.15;

    if (!isDistanceCorrect) {
        return {
            isCalibrated: false,
            feedback: "Get closer! Camera needs to see you clearly.",
            checks: {
                isBodyVisible: true,
                isCentered: true,
                isDistanceCorrect: false,
                isLevel: false,
            },
        };
    }

    // 4. Level Check (Optional but good for store consistency)
    // Simple check: Shoulders roughly same Y
    const isLevel = Math.abs(leftShoulder.y - rightShoulder.y) < 0.05;

    return {
        isCalibrated: true,
        feedback: "Perfect! Stay there.",
        checks: {
            isBodyVisible: true,
            isCentered: true,
            isDistanceCorrect: true,
            isLevel,
        },
    };
}

/**
 * Requirement 3: The Workout Engine
 * Analyzes squat mechanics.
 */
// --- Logic ---

// ... (previous code)

/**
 * Requirement 3: The Workout Engine
 * Analyzes squat mechanics.
 */
export function analyzeSquat(
    landmarks: NormalizedLandmark[],
    currentState: SquatState
): SquatResult {
    // ... (existing squat logic)
    // RE-INSERTING EXISTING LOGIC TO KEEP FILE VALID
    const rightHip = landmarks[24];
    const rightKnee = landmarks[26];
    const rightAnkle = landmarks[28];
    const leftHip = landmarks[23];
    const leftKnee = landmarks[25];
    const leftAnkle = landmarks[27];

    const rightAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
    const leftAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
    const angle = (rightAngle + leftAngle) / 2;

    let { stage, minAngle } = currentState;
    let didRep = false;
    let scoreAdjustment = 0;
    let feedback = "";

    if (stage === "UP") {
        if (angle < 100) {
            stage = "DOWN";
            minAngle = angle;
            feedback = "Go lower...";
        } else {
            minAngle = 180;
            feedback = "Start Squat";
        }
    } else if (stage === "DOWN") {
        if (angle < minAngle) minAngle = angle;

        if (angle < 80) {
            feedback = "Too Deep!";
        } else if (angle > 110) {
            feedback = "Go Lower!";
        } else {
            feedback = "Good depth, now UP!";
        }

        if (angle > 160) {
            stage = "UP";
            didRep = true;
            if (minAngle < 80) {
                scoreAdjustment = -5;
                feedback = "Warning: too deep";
            } else if (minAngle > 110) {
                scoreAdjustment = -10;
                feedback = "Nice Rep!";
            } else {
                feedback = "Perfect form";
                scoreAdjustment = 5;
            }
        }
    }

    return { stage, didRep, scoreAdjustment, feedback, minAngle };
}

/**
 * PUSHUP ANALYSIS
 */
export interface PushupState {
    stage: "UP" | "DOWN";
    minElbowAngle: number;
}

export function analyzePushup(
    landmarks: NormalizedLandmark[],
    currentState: PushupState
): SquatResult { // Reusing SquatResult structure for generic result
    const leftShoulder = landmarks[11];
    const leftElbow = landmarks[13];
    const leftWrist = landmarks[15];

    // Elbow Angle
    const angle = calculateAngle(leftShoulder, leftElbow, leftWrist);

    let { stage, minElbowAngle } = currentState;
    let didRep = false;
    let scoreAdjustment = 0;
    let feedback = "";

    if (stage === "UP") {
        if (angle < 90) {
            stage = "DOWN";
            minElbowAngle = angle;
            feedback = "Push UP!";
        } else {
            feedback = "Start Pushup";
        }
    } else if (stage === "DOWN") {
        if (angle < minElbowAngle) minElbowAngle = angle;

        if (angle > 160) {
            stage = "UP";
            didRep = true;
            feedback = "Good Pushup!";
            scoreAdjustment = 5;
        } else {
            feedback = "Push UP!";
        }
    }

    return { stage, didRep, scoreAdjustment, feedback, minAngle: minElbowAngle };
}

/**
 * JUMPING JACK ANALYSIS
 */
export interface JumpingJackState {
    stage: "DOWN" | "UP"; // DOWN = Hands at sides, UP = Hands above head
}

export function analyzeJumpingJack(
    landmarks: NormalizedLandmark[],
    currentState: JumpingJackState
): SquatResult {
    const leftWrist = landmarks[15];
    const rightWrist = landmarks[16];
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];

    // Check if hands are above shoulders (Y decreases upwards)
    const handsUp = leftWrist.y < leftShoulder.y && rightWrist.y < rightShoulder.y;

    // Check if hands are significantly above head (e.g. clap) - keeping simple for now
    // Just checking Y relative to nose could be better?
    const nose = landmarks[0];
    const handsAboveHead = leftWrist.y < nose.y && rightWrist.y < nose.y;

    let { stage } = currentState;
    let didRep = false;
    let scoreAdjustment = 0;
    let feedback = "";

    if (stage === "DOWN") {
        if (handsAboveHead) {
            stage = "UP";
            feedback = "Hands Down!";
        } else {
            feedback = "Jump!";
        }
    } else if (stage === "UP") {
        // Hands back below shoulders
        if (!handsUp) {
            stage = "DOWN";
            didRep = true;
            scoreAdjustment = 2; // Less complex, smaller reward?
            feedback = "Good!";
        } else {
            feedback = "Hands Down!";
        }
    }

    return { stage, didRep, scoreAdjustment, feedback, minAngle: 0 };
}
