import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, ChevronDown, CheckCircle2, Smartphone, Battery, Bluetooth } from "lucide-react";
import { useState } from "react";

interface HomeScreenProps {
  username: string;
  onStartECG: () => void;
}

const HomeScreen = ({ username, onStartECG }: HomeScreenProps) => {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-light pb-20">
      <div className="max-w-md mx-auto px-6 pt-8">
        {/* Welcome Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Welcome back, {username}! 👋
          </h1>
          <p className="text-muted-foreground">How are you feeling today?</p>
        </div>

        {/* Hero Card */}
        <Card className="bg-gradient-hero border-0 shadow-card mb-6 overflow-hidden">
          <CardContent className="p-6 text-white relative">
            <div className="relative z-10">
              <h2 className="text-xl font-bold mb-2">Monitor Your Heart</h2>
              <p className="text-white/90 text-sm mb-6">
                Professional ECG analysis in seconds
              </p>
              
              <Button 
                variant="secondary" 
                size="lg" 
                onClick={onStartECG}
                className="bg-white text-primary hover:bg-white/90 font-semibold"
              >
                <Heart className="w-4 h-4 mr-2" />
                Let's Check
              </Button>
            </div>
            
            {/* Decorative background pattern */}
            <div className="absolute top-0 right-0 w-24 h-24 opacity-20">
              <div className="w-full h-full bg-white/10 rounded-full flex items-center justify-center">
                <Heart className="w-12 h-12" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How to Use Guide */}
        <Card className="shadow-card">
          <CardHeader 
            className="pb-3 cursor-pointer"
            onClick={() => setShowGuide(!showGuide)}
          >
            <CardTitle className="flex items-center justify-between text-lg">
              <span>How to Use Cardiogram</span>
              <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${showGuide ? 'rotate-180' : ''}`} />
            </CardTitle>
          </CardHeader>
          
          {showGuide && (
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="bg-primary-lighter rounded-full p-2 mt-1">
                    <Bluetooth className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">1. Connect Device</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Ensure your ECG device is nearby and Bluetooth is enabled
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-primary-lighter rounded-full p-2 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">2. Patient Information</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Fill in basic patient details for accurate analysis
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-primary-lighter rounded-full p-2 mt-1">
                    <Heart className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">3. Take Recording</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Stay still for 30 seconds while we capture your ECG
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-primary-lighter rounded-full p-2 mt-1">
                    <Smartphone className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">4. View Results</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Get instant analysis and save reports for later
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">0</div>
              <div className="text-xs text-muted-foreground">Total Recordings</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-success mb-1">0</div>
              <div className="text-xs text-muted-foreground">Normal Results</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;