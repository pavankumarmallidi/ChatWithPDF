
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Sparkles, FileText } from "lucide-react";

interface AuthPageProps {
  onBackToHome?: () => void;
  onSuccess?: () => void;
}

const AuthPage = ({ onBackToHome, onSuccess }: AuthPageProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const { toast } = useToast();
  const { signIn, signUp } = useAuth();

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setFullName("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      if (!email || !password) {
        toast({
          title: "Missing credentials",
          description: "Please enter both email and password.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const { data, error } = await signIn(email.trim(), password);
      
      if (error) {
        let errorMessage = error.message;
        
        if (error.message.includes('email_not_confirmed')) {
          errorMessage = "Please check your email and click the confirmation link before logging in.";
        } else if (error.message.includes('Invalid login credentials')) {
          errorMessage = "Invalid email or password. Please check your credentials and try again.";
        }
        
        toast({
          title: "Login failed",
          description: errorMessage,
          variant: "destructive",
        });
      } else if (data.user) {
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
        });
        resetForm();
        onSuccess?.();
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      if (!email || !password || !fullName) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const { data, error } = await signUp(email.trim(), password, fullName.trim());
      
      if (error) {
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Account created!",
          description: "Please check your email to confirm your account before logging in.",
        });
        resetForm();
        setActiveTab("login");
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabClick = (tab: string) => {
    if (!isLoading) {
      setActiveTab(tab);
      resetForm();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#16213e] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
      
      {onBackToHome && (
        <div className="absolute top-6 left-6 z-20">
          <Button
            onClick={onBackToHome}
            className="bg-[#1a1a2e] border border-[#2d3748] text-white hover:bg-[#2a2a3e] rounded-2xl transition-all duration-300"
            disabled={isLoading}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      )}

      <div className="flex items-center justify-center min-h-screen p-6 relative z-10">
        <Card className="w-full max-w-md bg-[#1e1e2e] border-[#2d3748] shadow-2xl rounded-3xl overflow-hidden animate-fade-in">
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-3xl flex items-center justify-center shadow-lg">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white tracking-tight">PDFChat AI</h1>
                  <div className="flex items-center gap-1 justify-center">
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    <p className="text-sm font-medium text-purple-400">AI-powered analysis</p>
                  </div>
                </div>
              </div>
              <p className="text-gray-300 text-sm">Transform your documents with intelligent conversation</p>
            </div>

            {/* Tab Toggle */}
            <div className="flex bg-[#1a1a2e] rounded-full p-1 mb-8 relative">
              <button
                type="button"
                onClick={() => handleTabClick("login")}
                disabled={isLoading}
                className={`flex-1 py-3 text-sm font-medium rounded-full transition-all duration-300 relative z-10 ${
                  activeTab === "login"
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                } ${isLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
              >
                LOGIN
              </button>
              <button
                type="button"
                onClick={() => handleTabClick("signup")}
                disabled={isLoading}
                className={`flex-1 py-3 text-sm font-medium rounded-full transition-all duration-300 relative z-10 ${
                  activeTab === "signup"
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                } ${isLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
              >
                SIGN UP
              </button>
              <div 
                className={`absolute top-1 bottom-1 w-1/2 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-full transition-transform duration-300 ${
                  activeTab === "signup" ? "transform translate-x-full" : ""
                }`}
              />
            </div>

            {/* Login Form */}
            {activeTab === "login" && (
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    disabled={isLoading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-4 bg-[#1a1a2e] border border-[#2d3748] text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    disabled={isLoading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-4 bg-[#1a1a2e] border border-[#2d3748] text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading || !email.trim() || !password.trim()}
                  className="w-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#5855eb] hover:to-[#7c3aed] text-white py-4 rounded-2xl text-base font-medium shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLoading ? "Signing in..." : "LOGIN"}
                </Button>
              </form>
            )}

            {/* Signup Form */}
            {activeTab === "signup" && (
              <form onSubmit={handleRegister} className="space-y-6">
                <div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    disabled={isLoading}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-4 bg-[#1a1a2e] border border-[#2d3748] text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    disabled={isLoading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-4 bg-[#1a1a2e] border border-[#2d3748] text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    disabled={isLoading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-4 bg-[#1a1a2e] border border-[#2d3748] text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isLoading || !email.trim() || !password.trim() || !fullName.trim()}
                  className="w-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#5855eb] hover:to-[#7c3aed] text-white py-4 rounded-2xl text-base font-medium shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLoading ? "Creating account..." : "SIGN UP"}
                </Button>
              </form>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
