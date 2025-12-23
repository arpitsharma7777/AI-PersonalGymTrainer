import { useNavigate } from "react-router-dom";
import { CameraSetup } from "@/components/camera-coach/CameraSetup";
import { CameraFeed } from "@/components/camera-coach/CameraFeed";

export default function CameraCoach() {
  const navigate = useNavigate();

  const handleSetupComplete = () => {
    navigate("/workout");
  };

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-8">Camera Setup</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <p className="text-muted-foreground">Position your camera to capture your full body</p>
              <CameraFeed />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">
                Setup Checklist
              </h2>
              <CameraSetup onSetupComplete={handleSetupComplete} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
