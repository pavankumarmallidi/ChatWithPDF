import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, FileText, Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles, Shield } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
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

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 relative overflow-hidden flex items-center justify-center">
      {/* Premium dark background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/30 via-gray-800/20 to-black/40" />
      
      {/* Subtle dark glow effects */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120vh] h-[60vh] rounded-b-[50%] bg-gray-600/5 blur-[80px]" />
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[90vh] h-[90vh] rounded-t-full bg-gray-600/5 blur-[60px]" />

      {/* Dark accent spots */}
      <div className="absolute left-1/4 top-1/4 w-96 h-96 bg-gray-400/3 rounded-full blur-[100px]" />
      <div className="absolute right-1/4 bottom-1/4 w-96 h-96 bg-gray-400/3 rounded-full blur-[100px]" />

      {onBackToHome && (
        <div className="absolute top-6 left-6 z-20">
          <Button
            onClick={onBackToHome}
            variant="outline"
            className="bg-gray-900/40 border-gray-700/50 text-gray-300 hover:bg-gray-800/50 hover:text-white backdrop-blur-sm rounded-3xl transition-all duration-200"
            disabled={isLoading}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      )}

      {/* Main container */}
      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent mb-2">
            Welcome to ChatWithPDF
          </h1>
          <p className="text-gray-300 text-lg font-light">
            {activeTab === "login" ? "Sign in to your account" : "Create your free account"}
          </p>
          
          {/* Free service highlight */}
          <div className="mt-4 flex items-center justify-center gap-2 text-gray-400">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">100% Free Forever</span>
            <Shield className="w-4 h-4" />
          </div>
        </div>

        {/* Auth form card */}
        <div className="bg-gradient-to-r from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-600/30 rounded-3xl p-8 shadow-2xl">
          {/* Tab navigation */}
          <div className="flex bg-gray-900/50 rounded-3xl p-1 mb-8">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-3 px-4 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                activeTab === "login"
                  ? "bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-lg"
                  : "text-gray-400 hover:text-gray-300"
              }`}
              disabled={isLoading}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 py-3 px-4 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                activeTab === "register"
                  ? "bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-lg"
                  : "text-gray-400 hover:text-gray-300"
              }`}
              disabled={isLoading}
            >
              Sign Up
            </button>
          </div>

          {/* Login Form */}
          {activeTab === "login" && (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedInput("email")}
                      onBlur={() => setFocusedInput(null)}
                      className={`w-full pl-12 pr-4 py-4 bg-gray-900/30 border rounded-3xl text-white placeholder-gray-400 transition-all duration-200 ${
                        focusedInput === "email"
                          ? "border-gray-500 shadow-lg shadow-gray-500/25"
                          : "border-gray-700/50 hover:border-gray-600/50"
                      }`}
                      placeholder="Enter your email"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedInput("password")}
                      onBlur={() => setFocusedInput(null)}
                      className={`w-full pl-12 pr-12 py-4 bg-gray-900/30 border rounded-3xl text-white placeholder-gray-400 transition-all duration-200 ${
                        focusedInput === "password"
                          ? "border-gray-500 shadow-lg shadow-gray-500/25"
                          : "border-gray-700/50 hover:border-gray-600/50"
                      }`}
                      placeholder="Enter your password"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white py-4 rounded-3xl font-semibold text-lg shadow-lg hover:shadow-2xl hover:shadow-gray-500/25 transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing In...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </Button>
            </form>
          )}

          {/* Register Form */}
          {activeTab === "register" && (
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      onFocus={() => setFocusedInput("fullName")}
                      onBlur={() => setFocusedInput(null)}
                      className={`w-full pl-12 pr-4 py-4 bg-gray-900/30 border rounded-3xl text-white placeholder-gray-400 transition-all duration-200 ${
                        focusedInput === "fullName"
                          ? "border-gray-500 shadow-lg shadow-gray-500/25"
                          : "border-gray-700/50 hover:border-gray-600/50"
                      }`}
                      placeholder="Enter your full name"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedInput("email")}
                      onBlur={() => setFocusedInput(null)}
                      className={`w-full pl-12 pr-4 py-4 bg-gray-900/30 border rounded-3xl text-white placeholder-gray-400 transition-all duration-200 ${
                        focusedInput === "email"
                          ? "border-gray-500 shadow-lg shadow-gray-500/25"
                          : "border-gray-700/50 hover:border-gray-600/50"
                      }`}
                      placeholder="Enter your email"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedInput("password")}
                      onBlur={() => setFocusedInput(null)}
                      className={`w-full pl-12 pr-12 py-4 bg-gray-900/30 border rounded-3xl text-white placeholder-gray-400 transition-all duration-200 ${
                        focusedInput === "password"
                          ? "border-gray-500 shadow-lg shadow-gray-500/25"
                          : "border-gray-700/50 hover:border-gray-600/50"
                      }`}
                      placeholder="Create a password"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white py-4 rounded-3xl font-semibold text-lg shadow-lg hover:shadow-2xl hover:shadow-gray-500/25 transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Account...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    Create Account
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </Button>
            </form>
          )}

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              {activeTab === "login" ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setActiveTab(activeTab === "login" ? "register" : "login")}
                className="text-gray-300 hover:text-white font-medium transition-colors"
                disabled={isLoading}
              >
                {activeTab === "login" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>

        {/* Bottom info */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Chat with multiple PDFs • 100% Free • Secure & Private
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
