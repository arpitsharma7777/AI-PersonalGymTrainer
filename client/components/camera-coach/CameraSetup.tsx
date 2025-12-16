import { useState, useEffect } from "react";
import { CameraChecklistItem } from "./CameraChecklistItem";
import { Button } from "@/components/ui/button";

interface CameraSetupProps {
  onSetupComplete: () => void;
}

export function CameraSetup({ onSetupComplete }: CameraSetupProps) {
  const [isScanning, setIsScanning] = useState(true);
  const [allChecked, setAllChecked] = useState(false);

  const checklistItems = [
    "Full body visible",
    "Body Centered",
    "Correct Distance",
    "Camera Tilt (Level)",
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsScanning(false);
      setAllChecked(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      {isScanning ? (
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 border-4 border-primary rounded-full animate-spin border-t-transparent" />
          </div>
          <p className="text-xl text-muted-foreground">Scanning...</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {checklistItems.map((item) => (
              <CameraChecklistItem key={item} label={item} completed={true} />
            ))}
          </div>

          {allChecked && (
            <Button
              onClick={onSetupComplete}
              size="lg"
              className="w-full text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Setup Complete - Start Workout
            </Button>
          )}
        </>
      )}
    </div>
  );
}
