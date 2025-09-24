import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import LoginScreen from "@/components/screens/LoginScreen";
import HomeScreen from "@/components/screens/HomeScreen";
import ECGRecordingScreen from "@/components/screens/ECGRecordingScreen";
import ReportsScreen from "@/components/screens/ReportsScreen";
import ProfileScreen from "@/components/screens/ProfileScreen";

const queryClient = new QueryClient();

type Screen = "login" | "home" | "ecg" | "reports" | "profile";

const App = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");
  const [activeTab, setActiveTab] = useState("home");
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);

  const handleLogin = (email: string, password: string) => {
    // Simulate login - in real app this would call Firebase Auth
    const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    setUser({ email, name });
    setCurrentScreen("home");
    setActiveTab("home");
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen("login");
    setActiveTab("home");
  };

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

  const renderScreen = () => {
    if (!user) {
      return <LoginScreen onLogin={handleLogin} />;
    }

    switch (currentScreen) {
      case "home":
        return <HomeScreen username={user.name} onStartECG={handleStartECG} />;
      case "ecg":
        return <ECGRecordingScreen onComplete={handleECGComplete} onCancel={handleECGCancel} />;
      case "reports":
        return <ReportsScreen onStartRecording={handleStartECG} />;
      case "profile":
        return <ProfileScreen username={user.name} email={user.email} onLogout={handleLogout} />;
      default:
        return <HomeScreen username={user.name} onStartECG={handleStartECG} />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          {renderScreen()}
          {user && (
            <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
          )}
        </div>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
