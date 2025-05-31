import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, MessageCircle } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

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
        className="peer w-full px-4 py-3 input-base text-primary placeholder-transparent focus:outline-none focus:ring-2 transition-all duration-200 rounded-xl theme-transition"
        style={{
          backgroundColor: 'var(--input-bg)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)'
        }}
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
        className={`absolute left-4 transition-all duration-200 pointer-events-none ${
          focused || hasValue
            ? '-top-2 text-xs bg-primary px-2'
            : 'top-3 text-secondary'
        }`}
        style={{
          color: focused || hasValue ? 'var(--accent-color)' : 'var(--text-secondary)',
          backgroundColor: focused || hasValue ? 'var(--bg-primary)' : 'transparent'
        }}
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
    <div className="min-h-screen bg-primary relative theme-transition">
      <div className="absolute top-6 left-6 flex items-center gap-3 z-20">
        {onBackToHome && (
          <Button
            onClick={onBackToHome}
            variant="ghost"
            className="text-secondary hover:text-primary hover-bg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        )}
        <ThemeToggle />
      </div>

      <div className="flex items-center justify-center min-h-screen p-6">
        <Card className="w-full max-w-md card-base shadow-xl rounded-3xl overflow-hidden animate-fade-in theme-transition">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-16 h-16 btn-primary rounded-2xl flex items-center justify-center shadow-lg">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-primary tracking-tight">PDFChat AI</h1>
                  <p className="text-sm font-medium" style={{ color: 'var(--accent-color)' }}>AI-powered analysis</p>
                </div>
              </div>
              <p className="text-secondary text-sm">Transform your documents with intelligent conversation</p>
            </div>

            <Tabs defaultValue="login" className="w-full">
              <TabsList 
                className="grid w-full grid-cols-2 mb-8 rounded-2xl p-1"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
              >
                <TabsTrigger 
                  value="login" 
                  className="text-secondary data-[state=active]:text-primary rounded-xl font-medium theme-transition"
                  style={{
                    backgroundColor: 'transparent'
                  }}
                >
                  LOGIN
                </TabsTrigger>
                <TabsTrigger 
                  value="register" 
                  className="text-secondary data-[state=active]:text-primary rounded-xl font-medium theme-transition"
                  style={{
                    backgroundColor: 'transparent'
                  }}
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
                    <label className="flex items-center text-secondary">
                      <input type="checkbox" className="mr-2 w-4 h-4 rounded" style={{ accentColor: 'var(--accent-color)' }} />
                      Remember me
                    </label>
                    <a href="#" className="hover:underline transition-colors" style={{ color: 'var(--accent-color)' }}>Forgot password?</a>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full btn-primary py-3 rounded-2xl text-base font-medium mt-8 shadow-lg transition-all duration-300"
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
                    className="w-full btn-primary py-3 rounded-2xl text-base font-medium mt-8 shadow-lg transition-all duration-300"
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
