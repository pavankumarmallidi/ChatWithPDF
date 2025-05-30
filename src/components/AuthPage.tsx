
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { FileText, ArrowLeft, MessageCircle, Zap } from "lucide-react";

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
}

const FloatingInput = ({ id, name, type, placeholder, required = false, disabled = false }: FloatingInputProps) => {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  return (
    <div className="relative mb-6">
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        disabled={disabled}
        className="peer w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-600 text-white placeholder-transparent focus:border-orange-500 focus:outline-none transition-colors"
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          setFocused(false);
          setHasValue(e.target.value !== '');
        }}
        onChange={(e) => setHasValue(e.target.value !== '')}
      />
      <label
        htmlFor={id}
        className={`absolute left-0 transition-all duration-200 pointer-events-none ${
          focused || hasValue
            ? '-top-6 text-sm text-orange-500'
            : 'top-3 text-gray-400'
        }`}
      >
        {placeholder}
      </label>
    </div>
  );
};

const AuthPage = ({ onBackToHome, onSuccess }: AuthPageProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signIn, signUp } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    console.log('Login attempt for email:', email);

    const { data, error } = await signIn(email, password);
    
    if (error) {
      console.error('Login error:', error);
      
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
      console.log('Login successful:', data.user);
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });
      onSuccess?.();
    }
    
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;

    console.log('Registration attempt for email:', email);

    const { data, error } = await signUp(email, password, fullName);
    
    if (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      console.log('Registration successful:', data);
      toast({
        title: "Account created!",
        description: "Please check your email to confirm your account before logging in.",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background effects matching the main design */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-black to-red-500/10"></div>
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>

      {/* Back button */}
      {onBackToHome && (
        <Button
          onClick={onBackToHome}
          variant="ghost"
          className="absolute top-6 left-6 text-gray-300 hover:text-white hover:bg-gray-800/50 z-20 backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      )}

      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <Card className="w-full max-w-md bg-gray-900/50 backdrop-blur-xl border-gray-800 shadow-2xl rounded-3xl overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white tracking-tight">PDFChat AI</h1>
                  <div className="flex items-center gap-1 text-orange-400 text-sm">
                    <Zap className="w-3 h-3" />
                    <span>AI-powered analysis</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-400 text-sm">Transform your documents with intelligent conversation</p>
            </div>

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800/50 backdrop-blur-sm mb-8 rounded-2xl">
                <TabsTrigger 
                  value="login" 
                  className="text-gray-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-medium"
                >
                  LOGIN
                </TabsTrigger>
                <TabsTrigger 
                  value="register" 
                  className="text-gray-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-medium"
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
                  />
                  <FloatingInput
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    disabled={isLoading}
                  />
                  
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center text-gray-300">
                      <input type="checkbox" className="mr-2 w-4 h-4 text-orange-500 rounded border-gray-500 focus:ring-orange-500 bg-gray-700" />
                      Remember me
                    </label>
                    <a href="#" className="text-orange-400 hover:text-orange-300 transition-colors">Forgot password?</a>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-2xl text-base font-medium mt-8 shadow-lg shadow-orange-500/25 transition-all duration-300 hover:shadow-orange-500/40"
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
                  />
                  <FloatingInput
                    id="reg-email"
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    required
                    disabled={isLoading}
                  />
                  <FloatingInput
                    id="reg-password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    disabled={isLoading}
                  />
                  
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-2xl text-base font-medium mt-8 shadow-lg shadow-orange-500/25 transition-all duration-300 hover:shadow-orange-500/40"
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
