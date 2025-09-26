import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import LoginScreen from "@/components/screens/LoginScreen";
import HomeScreen from "@/components/screens/HomeScreen";
import ECGRecordingScreen from "@/components/screens/ECGRecordingScreen";
import ReportsScreen from "@/components/screens/ReportsScreen";
import ProfileScreen from "@/components/screens/ProfileScreen";

const queryClient = new QueryClient();

type Screen = "login" | "home" | "ecg" | "reports" | "profile";

const AppContent = () => {
  const { user, loading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [activeTab, setActiveTab] = useState("home");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentScreen(tab as Screen);
  };

  const handleStartECG = () => {
    setCurrentScreen("ecg");
    setActiveTab("ecg");
  };

  const handleECGComplete = () => {
    setCurrentScreen("reports");
    setActiveTab("reports");
  };

  const handleECGCancel = () => {
    setCurrentScreen("home");
    setActiveTab("home");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-primary rounded-full animate-pulse mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const renderScreen = () => {
    if (!user) {
      return <LoginScreen />;
    }

    switch (currentScreen) {
      case "home":
        return <HomeScreen onStartECG={handleStartECG} />;
      case "ecg":
        return <ECGRecordingScreen onComplete={handleECGComplete} onCancel={handleECGCancel} />;
      case "reports":
        return <ReportsScreen onStartRecording={handleStartECG} />;
      case "profile":
        return <ProfileScreen />;
      default:
        return <HomeScreen onStartECG={handleStartECG} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderScreen()}
      {user && (
        <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
      )}
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
