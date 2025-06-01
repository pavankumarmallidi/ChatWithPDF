
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Sparkles, FileText } from "lucide-react";

interface AuthPageProps {
  onBackToHome?: () => void;
  onSuccess?: () => void;
}

interface FloatingInputProps {
  id: string;
  name: string;
  type: string;
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FloatingInput = ({ id, name, type, placeholder, required = false, disabled = false, value, onChange }: FloatingInputProps) => {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;

  return (
    <div className="relative mb-6">
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        disabled={disabled}
        value={value}
        onChange={onChange}
        className="peer w-full px-4 py-4 bg-[#1a1a2e] border border-[#2d3748] text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 rounded-2xl"
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <label
        htmlFor={id}
        className={`absolute left-4 transition-all duration-300 pointer-events-none ${
          focused || hasValue
            ? '-top-2 text-xs bg-[#1e1e2e] px-2 text-purple-400'
            : 'top-4 text-gray-400'
        } rounded-md`}
      >
        {placeholder}
      </label>
    </div>
  );
};

const AuthPage = ({ onBackToHome, onSuccess }: AuthPageProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ email: '', password: '', fullName: '' });
  const { toast } = useToast();
  const { signIn, signUp } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const { email, password } = loginForm;

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
      const { email, password, fullName } = registerForm;

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
        setRegisterForm({ email: '', password: '', fullName: '' });
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
      
      <div className="absolute top-6 left-6 z-20">
        {onBackToHome && (
          <Button
            onClick={onBackToHome}
            className="bg-[#1a1a2e] border border-[#2d3748] text-white hover:bg-[#2a2a3e] rounded-xl transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        )}
      </div>

      <div className="flex items-center justify-center min-h-screen p-6">
        <Card className="w-full max-w-md bg-[#1e1e2e] border-[#2d3748] shadow-2xl rounded-3xl overflow-hidden animate-fade-in">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-3xl flex items-center justify-center shadow-lg animate-pulse">
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

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 rounded-2xl p-1 bg-[#1a1a2e]">
                <TabsTrigger 
                  value="login" 
                  className="text-gray-400 data-[state=active]:text-white rounded-xl font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6366f1] data-[state=active]:to-[#8b5cf6]"
                >
                  LOGIN
                </TabsTrigger>
                <TabsTrigger 
                  value="register" 
                  className="text-gray-400 data-[state=active]:text-white rounded-xl font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6366f1] data-[state=active]:to-[#8b5cf6]"
                >
                  SIGN UP
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-0">
                <form onSubmit={handleLogin} className="space-y-6">
                  <FloatingInput
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    required
                    disabled={isLoading}
                    value={loginForm.email}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                  <FloatingInput
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    disabled={isLoading}
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  />
                  
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center text-gray-400">
                      <input type="checkbox" className="mr-2 w-4 h-4 rounded-md accent-purple-500" />
                      Remember me
                    </label>
                    <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">Forgot password?</a>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#5855eb] hover:to-[#7c3aed] text-white py-4 rounded-2xl text-base font-medium mt-8 shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    {isLoading ? "Signing in..." : "LOGIN"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="mt-0">
                <form onSubmit={handleRegister} className="space-y-6">
                  <FloatingInput
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Full Name"
                    required
                    disabled={isLoading}
                    value={registerForm.fullName}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, fullName: e.target.value }))}
                  />
                  <FloatingInput
                    id="reg-email"
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    required
                    disabled={isLoading}
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                  <FloatingInput
                    id="reg-password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    disabled={isLoading}
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                  />
                  
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#5855eb] hover:to-[#7c3aed] text-white py-4 rounded-2xl text-base font-medium mt-8 shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    {isLoading ? "Creating account..." : "SIGN UP"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
