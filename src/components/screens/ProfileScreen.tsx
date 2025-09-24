import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, Calendar, Activity, LogOut, Settings } from "lucide-react";

interface ProfileScreenProps {
  username: string;
  email: string;
  onLogout: () => void;
}

const ProfileScreen = ({ username, email, onLogout }: ProfileScreenProps) => {
  return (
    <div className="min-h-screen bg-gradient-light pb-20">
      <div className="max-w-md mx-auto px-6 pt-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-1">Profile</h1>
          <p className="text-muted-foreground">Manage your account and settings</p>
        </div>

        {/* Profile Card */}
        <Card className="shadow-card mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-white">
                  {username.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{username}</h3>
                <p className="text-muted-foreground text-sm">{email}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-3 text-muted-foreground" />
                <span className="text-muted-foreground mr-2">Email:</span>
                <span>{email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-3 text-muted-foreground" />
                <span className="text-muted-foreground mr-2">Phone:</span>
                <span>Not provided</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-3 text-muted-foreground" />
                <span className="text-muted-foreground mr-2">Age:</span>
                <span>Not provided</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health Statistics */}
        <Card className="shadow-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Activity className="w-5 h-5 mr-2 text-primary" />
              Health Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-secondary rounded-lg">
              <div className="text-2xl font-bold text-primary mb-1">0</div>
              <div className="text-xs text-muted-foreground">Total Reports</div>
            </div>
            <div className="text-center p-4 bg-secondary rounded-lg">
              <div className="text-2xl font-bold text-success mb-1">0</div>
              <div className="text-xs text-muted-foreground">Normal Results</div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Options */}
        <Card className="shadow-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Settings className="w-5 h-5 mr-2 text-primary" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
              <span className="text-sm">Account Settings</span>
              <span className="text-muted-foreground">→</span>
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
              <span className="text-sm">Privacy Settings</span>
              <span className="text-muted-foreground">→</span>
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
              <span className="text-sm">Notifications</span>
              <span className="text-muted-foreground">→</span>
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
              <span className="text-sm">Help & Support</span>
              <span className="text-muted-foreground">→</span>
            </button>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Button 
          onClick={onLogout}
          variant="outline" 
          size="lg" 
          className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>

        {/* App Version */}
        <div className="text-center mt-6 text-xs text-muted-foreground">
          <p>Cardiogram v1.0.0</p>
          <p className="mt-1">© 2024 Cardiogram. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;