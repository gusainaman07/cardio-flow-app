import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  Bluetooth, 
  User, 
  Calendar, 
  Users, 
  Activity, 
  CheckCircle2, 
  Loader2,
  Heart,
  AlertCircle
} from "lucide-react";

interface ECGRecordingScreenProps {
  onComplete: () => void;
  onCancel: () => void;
}

type Step = 1 | 2 | 3 | 4;

const ECGRecordingScreen = ({ onComplete, onCancel }: ECGRecordingScreenProps) => {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(30);

  // Step 1: Device Connection
  const handleConnect = async () => {
    setIsConnecting(true);
    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsConnected(true);
    setIsConnecting(false);
    setCurrentStep(2);
  };

  // Step 2: Patient Information
  const handleStartRecording = () => {
    if (patientName && patientAge && patientGender) {
      setCurrentStep(3);
      startRecording();
    }
  };

  // Step 3: Recording Process
  const startRecording = () => {
    setIsRecording(true);
    const interval = setInterval(() => {
      setRecordingProgress(prev => {
        const newProgress = prev + (100 / 30); // 30 seconds total
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsRecording(false);
          setTimeout(() => {
            onComplete();
          }, 1000);
          return 100;
        }
        return newProgress;
      });
      
      setTimeRemaining(prev => {
        const newTime = prev - 1;
        return newTime <= 0 ? 0 : newTime;
      });
    }, 1000);
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((step, index) => (
        <div key={step} className="flex items-center">
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
            ${currentStep >= step 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted text-muted-foreground'
            }
          `}>
            {currentStep > step ? <CheckCircle2 className="w-4 h-4" /> : step}
          </div>
          {index < 3 && (
            <div className={`
              w-12 h-0.5 mx-2
              ${currentStep > step ? 'bg-primary' : 'bg-muted'}
            `} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-light pb-20">
      <div className="max-w-md mx-auto px-6 pt-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-1">ECG Recording</h1>
          <p className="text-muted-foreground">Follow the steps to complete your ECG</p>
        </div>

        <StepIndicator />

        {/* Step 1: Connect Device */}
        {currentStep === 1 && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bluetooth className="w-5 h-5 mr-2 text-primary" />
                Connect ECG Device
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Make sure your ECG device is nearby and turned on
              </p>
              
              <div className="bg-secondary rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-sm">Device Requirements:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-success" />
                    Bluetooth-enabled ECG device
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-success" />
                    Fully charged battery
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-success" />
                    Clean electrode contacts
                  </li>
                </ul>
              </div>

              <Button 
                onClick={handleConnect} 
                disabled={isConnecting}
                variant="hero" 
                size="xl" 
                className="w-full"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Bluetooth className="w-4 h-4 mr-2" />
                    Connect Device
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Patient Information */}
        {currentStep === 2 && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2 text-primary" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Patient Name *</label>
                <Input
                  placeholder="Enter patient name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Age *</label>
                <Input
                  type="number"
                  placeholder="Enter age"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Gender *</label>
                <Select value={patientGender} onValueChange={setPatientGender}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleStartRecording}
                disabled={!patientName || !patientAge || !patientGender}
                variant="hero" 
                size="xl" 
                className="w-full mt-6"
              >
                <Activity className="w-4 h-4 mr-2" />
                Start Recording
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Recording in Progress */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <Card className="shadow-card text-center">
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-primary-lighter rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-primary animate-pulse" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Recording ECG...</h3>
                  <p className="text-muted-foreground">Please remain still</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round(recordingProgress)}%</span>
                  </div>
                  <Progress value={recordingProgress} className="h-2" />
                  
                  <div className="text-2xl font-bold text-primary">
                    {timeRemaining}s
                  </div>
                  <p className="text-xs text-muted-foreground">remaining</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <AlertCircle className="w-5 h-5 mr-2 text-primary" />
                  Recording Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-success" />
                  Keep your body relaxed
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-success" />
                  Breathe normally
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-success" />
                  Avoid talking or moving
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Cancel Button */}
        {currentStep < 3 && (
          <div className="mt-6">
            <Button variant="ghost" onClick={onCancel} className="w-full">
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ECGRecordingScreen;