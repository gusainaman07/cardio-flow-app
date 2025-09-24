import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heart, User, Lock, Mail } from "lucide-react";

interface LoginScreenProps {
  onLogin: (email: string, password: string) => void;
}

const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-light flex flex-col">
      {/* Header with gradient */}
      <div className="bg-gradient-primary h-48 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white/20 rounded-full p-4">
                <Heart className="w-8 h-8" />
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-2">Cardiogram</h1>
            <p className="text-white/90 text-sm">Professional ECG monitoring</p>
          </div>
        </div>
        
        {/* Decorative medical illustration placeholder */}
        <div className="absolute bottom-0 right-0 w-32 h-32 opacity-20">
          <div className="w-full h-full bg-white/10 rounded-full flex items-center justify-center">
            <User className="w-16 h-16" />
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex-1 px-6 -mt-8">
        <Card className="shadow-card">
          <CardHeader className="pb-4">
            <h2 className="text-xl font-semibold text-center">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-muted-foreground text-center text-sm">
              {isSignUp 
                ? "Join thousands monitoring their heart health" 
                : "Sign in to continue monitoring your heart"
              }
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" variant="hero" size="xl" className="w-full">
                {isSignUp ? "Create Account" : "Sign In"}
              </Button>
            </form>

            <div className="text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-primary hover:underline"
              >
                {isSignUp 
                  ? "Already have an account? Sign in" 
                  : "Don't have an account? Sign up"
                }
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 mb-24 text-xs text-muted-foreground">
          <p>By continuing, you agree to our Terms of Service</p>
          <p className="mt-1">Your health data is encrypted and secure</p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;