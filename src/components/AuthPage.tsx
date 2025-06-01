
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, FileText, Sparkles } from "lucide-react";

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
        <div className="w-full max-w-4xl h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden flex">
          
          {/* Left Panel - Welcome/Info */}
          <div className="flex-1 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] p-12 flex flex-col justify-center text-white relative">
            <div className="absolute top-8 left-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">PDFChat AI</span>
              </div>
            </div>
            
            <div className="text-center">
              {activeTab === "login" ? (
                <>
                  <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
                  <p className="text-lg opacity-90 mb-8">
                    To keep connected with us please login with your personal info
                  </p>
                  <Button
                    onClick={() => setActiveTab("signup")}
                    disabled={isLoading}
                    className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#6366f1] px-8 py-3 rounded-full font-semibold transition-all duration-300"
                  >
                    SIGN UP
                  </Button>
                </>
              ) : (
                <>
                  <h2 className="text-4xl font-bold mb-4">Hello, Friend!</h2>
                  <p className="text-lg opacity-90 mb-8">
                    Enter your personal details and start journey with us
                  </p>
                  <Button
                    onClick={() => setActiveTab("login")}
                    disabled={isLoading}
                    className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#6366f1] px-8 py-3 rounded-full font-semibold transition-all duration-300"
                  >
                    SIGN IN
                  </Button>
                </>
              )}
            </div>
            
            <div className="absolute bottom-8 left-8">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm opacity-80">AI-powered document analysis</span>
              </div>
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="flex-1 p-12 flex flex-col justify-center">
            
            {activeTab === "login" ? (
              <>
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">Sign in</h3>
                  <p className="text-gray-600">or use your account</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    disabled={isLoading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-4 bg-gray-100 border-0 text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366f1] transition-all duration-300 rounded-lg"
                  />
                  
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    disabled={isLoading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-4 bg-gray-100 border-0 text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366f1] transition-all duration-300 rounded-lg"
                  />

                  <Button 
                    type="submit" 
                    disabled={isLoading || !email.trim() || !password.trim()}
                    className="w-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#5855eb] hover:to-[#7c3aed] text-white py-4 rounded-full text-base font-semibold shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isLoading ? "Signing in..." : "SIGN IN"}
                  </Button>
                </form>
              </>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h3>
                  <p className="text-gray-600">or use your email for registration</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-6">
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    disabled={isLoading}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-4 bg-gray-100 border-0 text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366f1] transition-all duration-300 rounded-lg"
                  />
                  
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    disabled={isLoading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-4 bg-gray-100 border-0 text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366f1] transition-all duration-300 rounded-lg"
                  />
                  
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    disabled={isLoading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-4 bg-gray-100 border-0 text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366f1] transition-all duration-300 rounded-lg"
                  />
                  
                  <Button 
                    type="submit" 
                    disabled={isLoading || !email.trim() || !password.trim() || !fullName.trim()}
                    className="w-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#5855eb] hover:to-[#7c3aed] text-white py-4 rounded-full text-base font-semibold shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isLoading ? "Creating account..." : "SIGN UP"}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
