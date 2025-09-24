import { Home, Activity, FileText, User } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "ecg", label: "ECG", icon: Activity },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-card">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-around h-16 px-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isECG = tab.id === "ecg";
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex flex-col items-center justify-center space-y-1 p-2 rounded-lg transition-all duration-200",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center w-6 h-6 transition-all duration-200",
                  isActive && isECG && "text-primary"
                )}>
                  <Icon 
                    className={cn(
                      "w-5 h-5",
                      isActive && "scale-110",
                      isActive && isECG && "stroke-2"
                    )} 
                  />
                </div>
                <span className={cn(
                  "text-xs font-medium transition-all duration-200",
                  isActive && "scale-105"
                )}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;