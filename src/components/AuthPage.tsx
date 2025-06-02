import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, FileText, Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";

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

  // For 3D card effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

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
    <div className="min-h-screen w-screen bg-gray-950 relative overflow-hidden flex items-center justify-center">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-gray-800/40 to-gray-900/60" />
      
      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.02] mix-blend-soft-light" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }}
      />

      {/* Subtle background glow (reduced opacity) */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120vh] h-[60vh] rounded-b-[50%] bg-gray-600/5 blur-[80px]" />
      <motion.div 
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[100vh] h-[60vh] rounded-b-full bg-gray-500/8 blur-[60px]"
        animate={{ 
          opacity: [0.05, 0.1, 0.05],
          scale: [0.98, 1.02, 0.98]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          repeatType: "mirror"
        }}
      />
      <motion.div 
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[90vh] h-[90vh] rounded-t-full bg-gray-600/8 blur-[60px]"
        animate={{ 
          opacity: [0.1, 0.15, 0.1],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity,
          repeatType: "mirror",
          delay: 1
        }}
      />

      {/* Reduced glow spots */}
      <div className="absolute left-1/4 top-1/4 w-96 h-96 bg-gray-400/2 rounded-full blur-[100px] animate-pulse opacity-20" />
      <div className="absolute right-1/4 bottom-1/4 w-96 h-96 bg-gray-300/2 rounded-full blur-[100px] animate-pulse delay-1000 opacity-20" />

      {onBackToHome && (
        <div className="absolute top-6 left-6 z-20">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={onBackToHome}
              variant="outline"
              className="bg-gray-900/40 border-gray-700/50 text-gray-300 hover:bg-gray-800/50 hover:text-white backdrop-blur-sm rounded-xl transition-all duration-200"
              disabled={isLoading}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </motion.div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative z-10"
        style={{ perspective: 1500 }}
      >
        <motion.div
          className="relative"
          style={{ rotateX, rotateY }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          whileHover={{ z: 10 }}
        >
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <motion.div 
              className="flex items-center justify-center gap-3 mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <motion.div 
                className="w-14 h-14 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden border border-gray-600/40"
                whileHover={{ rotateY: 180 }}
                transition={{ duration: 0.6 }}
              >
                <FileText className="w-7 h-7 text-gray-300" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />
              </motion.div>
              <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-300">
                PDFOCREXTRACTOR
              </span>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-400 text-lg font-light"
            >
              AI-powered PDF analysis platform
            </motion.p>
          </motion.div>

          <div className="group">
            {/* Simplified card border (removed light beams) */}
            <div className="absolute -inset-[0.5px] rounded-3xl bg-gradient-to-r from-gray-500/10 via-gray-600/15 to-gray-500/10 opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
            
            {/* Auth Card */}
            <div className="relative bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl overflow-hidden">
              {/* Subtle card inner patterns */}
              <div className="absolute inset-0 opacity-[0.03]" 
                style={{
                  backgroundImage: `linear-gradient(135deg, white 0.5px, transparent 0.5px), linear-gradient(45deg, white 0.5px, transparent 0.5px)`,
                  backgroundSize: '30px 30px'
                }}
              />

              {/* Tab Switcher */}
              <motion.div 
                className="flex mb-8 bg-gray-700/30 rounded-2xl p-1 backdrop-blur-sm relative overflow-hidden"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-gray-600/20 to-gray-500/20 rounded-2xl"
                  layoutId="tab-background"
                  style={{
                    left: activeTab === "login" ? "4px" : "50%",
                    width: "calc(50% - 4px)",
                    height: "calc(100% - 8px)",
                    top: "4px"
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
                <motion.button
                  onClick={() => setActiveTab("login")}
                  disabled={isLoading}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 relative z-10 ${
                    activeTab === "login"
                      ? "bg-gradient-to-r from-gray-600 to-gray-500 text-white shadow-lg"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Sign In
                </motion.button>
                <motion.button
                  onClick={() => setActiveTab("signup")}
                  disabled={isLoading}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 relative z-10 ${
                    activeTab === "signup"
                      ? "bg-gradient-to-r from-gray-600 to-gray-500 text-white shadow-lg"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Sign Up
                </motion.button>
              </motion.div>

              <AnimatePresence mode="wait">
                {activeTab === "login" ? (
                  <motion.form 
                    key="login-form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleLogin} 
                    className="space-y-6"
                  >
                    <motion.div className="space-y-4">
                      {/* Email input */}
                      <motion.div 
                        className={`relative ${focusedInput === "email" ? 'z-10' : ''}`}
                        whileFocus={{ scale: 1.02 }}
                        whileHover={{ scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        {/* Removed the bright hover border */}
                        <div className="relative flex items-center overflow-hidden rounded-xl">
                          <Mail className={`absolute left-4 w-5 h-5 transition-all duration-300 ${
                            focusedInput === "email" ? 'text-gray-300' : 'text-gray-400'
                          }`} />
                          
                          <input
                            type="email"
                            placeholder="Enter your email"
                            required
                            disabled={isLoading}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => setFocusedInput("email")}
                            onBlur={() => setFocusedInput(null)}
                            className="w-full pl-12 pr-4 py-4 bg-gray-700/30 border border-gray-600/50 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600/50 focus:border-gray-600/70 transition-all duration-300 rounded-xl backdrop-blur-sm hover:bg-gray-700/40 focus:bg-gray-700/50"
                          />
                          
                          {/* Input highlight effect */}
                          {focusedInput === "email" && (
                            <motion.div 
                              layoutId="input-highlight"
                              className="absolute inset-0 bg-gray-600/5 -z-10 rounded-xl"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            />
                          )}
                        </div>
                      </motion.div>

                      {/* Password input */}
                      <motion.div 
                        className={`relative ${focusedInput === "password" ? 'z-10' : ''}`}
                        whileFocus={{ scale: 1.02 }}
                        whileHover={{ scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        {/* Removed the bright hover border */}
                        <div className="relative flex items-center overflow-hidden rounded-xl">
                          <Lock className={`absolute left-4 w-5 h-5 transition-all duration-300 ${
                            focusedInput === "password" ? 'text-gray-300' : 'text-gray-400'
                          }`} />
                          
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            required
                            disabled={isLoading}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setFocusedInput("password")}
                            onBlur={() => setFocusedInput(null)}
                            className="w-full pl-12 pr-14 py-4 bg-gray-700/30 border border-gray-600/50 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600/50 focus:border-gray-600/70 transition-all duration-300 rounded-xl backdrop-blur-sm hover:bg-gray-700/40 focus:bg-gray-700/50"
                          />
                          
                          <motion.button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 text-gray-400 hover:text-gray-300 transition-colors duration-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </motion.button>
                          
                          {/* Input highlight effect */}
                          {focusedInput === "password" && (
                            <motion.div 
                              layoutId="input-highlight"
                              className="absolute inset-0 bg-gray-600/5 -z-10 rounded-xl"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            />
                          )}
                        </div>
                      </motion.div>
                    </motion.div>

                    {/* Sign in button */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="relative group/button"
                    >
                      {/* Removed button glow effect */}
                      <Button 
                        type="submit" 
                        disabled={isLoading || !email.trim() || !password.trim()}
                        className="w-full relative overflow-hidden bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-550 hover:to-gray-450 text-white py-4 rounded-xl text-base font-semibold shadow-lg transition-all duration-300 hover:shadow-gray-600/25 disabled:opacity-50 disabled:cursor-not-allowed border-0"
                      >
                        {/* Removed white shimmer animation */}
                        <AnimatePresence mode="wait">
                          {isLoading ? (
                            <motion.div
                              key="loading"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center justify-center gap-3"
                            >
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Signing in...
                            </motion.div>
                          ) : (
                            <motion.span
                              key="button-text"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center justify-center gap-2"
                            >
                              Sign In
                              <ArrowRight className="w-4 h-4 group-hover/button:translate-x-1 transition-transform duration-300" />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </Button>
                    </motion.div>
                  </motion.form>
                ) : (
                  <motion.form 
                    key="signup-form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleRegister} 
                    className="space-y-6"
                  >
                    <motion.div className="space-y-4">
                      {/* Full Name input */}
                      <motion.div 
                        className={`relative ${focusedInput === "fullName" ? 'z-10' : ''}`}
                        whileFocus={{ scale: 1.02 }}
                        whileHover={{ scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        {/* Removed the bright hover border */}
                        <div className="relative flex items-center overflow-hidden rounded-xl">
                          <User className={`absolute left-4 w-5 h-5 transition-all duration-300 ${
                            focusedInput === "fullName" ? 'text-gray-300' : 'text-gray-400'
                          }`} />
                          
                          <input
                            type="text"
                            placeholder="Enter your full name"
                            required
                            disabled={isLoading}
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            onFocus={() => setFocusedInput("fullName")}
                            onBlur={() => setFocusedInput(null)}
                            className="w-full pl-12 pr-4 py-4 bg-gray-700/30 border border-gray-600/50 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600/50 focus:border-gray-600/70 transition-all duration-300 rounded-xl backdrop-blur-sm hover:bg-gray-700/40 focus:bg-gray-700/50"
                          />
                          
                          {/* Input highlight effect */}
                          {focusedInput === "fullName" && (
                            <motion.div 
                              layoutId="input-highlight"
                              className="absolute inset-0 bg-gray-600/5 -z-10 rounded-xl"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            />
                          )}
                        </div>
                      </motion.div>

                      {/* Email input */}
                      <motion.div 
                        className={`relative ${focusedInput === "email" ? 'z-10' : ''}`}
                        whileFocus={{ scale: 1.02 }}
                        whileHover={{ scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        {/* Removed the bright hover border */}
                        <div className="relative flex items-center overflow-hidden rounded-xl">
                          <Mail className={`absolute left-4 w-5 h-5 transition-all duration-300 ${
                            focusedInput === "email" ? 'text-gray-300' : 'text-gray-400'
                          }`} />
                          
                          <input
                            type="email"
                            placeholder="Enter your email"
                            required
                            disabled={isLoading}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => setFocusedInput("email")}
                            onBlur={() => setFocusedInput(null)}
                            className="w-full pl-12 pr-4 py-4 bg-gray-700/30 border border-gray-600/50 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600/50 focus:border-gray-600/70 transition-all duration-300 rounded-xl backdrop-blur-sm hover:bg-gray-700/40 focus:bg-gray-700/50"
                          />
                          
                          {/* Input highlight effect */}
                          {focusedInput === "email" && (
                            <motion.div 
                              layoutId="input-highlight"
                              className="absolute inset-0 bg-gray-600/5 -z-10 rounded-xl"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            />
                          )}
                        </div>
                      </motion.div>

                      {/* Password input */}
                      <motion.div 
                        className={`relative ${focusedInput === "password" ? 'z-10' : ''}`}
                        whileFocus={{ scale: 1.02 }}
                        whileHover={{ scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        {/* Removed the bright hover border */}
                        <div className="relative flex items-center overflow-hidden rounded-xl">
                          <Lock className={`absolute left-4 w-5 h-5 transition-all duration-300 ${
                            focusedInput === "password" ? 'text-gray-300' : 'text-gray-400'
                          }`} />
                          
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            required
                            disabled={isLoading}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setFocusedInput("password")}
                            onBlur={() => setFocusedInput(null)}
                            className="w-full pl-12 pr-14 py-4 bg-gray-700/30 border border-gray-600/50 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600/50 focus:border-gray-600/70 transition-all duration-300 rounded-xl backdrop-blur-sm hover:bg-gray-700/40 focus:bg-gray-700/50"
                          />
                          
                          <motion.button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 text-gray-400 hover:text-gray-300 transition-colors duration-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </motion.button>
                          
                          {/* Input highlight effect */}
                          {focusedInput === "password" && (
                            <motion.div 
                              layoutId="input-highlight"
                              className="absolute inset-0 bg-gray-600/5 -z-10 rounded-xl"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            />
                          )}
                        </div>
                      </motion.div>
                    </motion.div>

                    {/* Create Account button */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="relative group/button"
                    >
                      {/* Removed button glow effect */}
                      <Button 
                        type="submit" 
                        disabled={isLoading || !email.trim() || !password.trim() || !fullName.trim()}
                        className="w-full relative overflow-hidden bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-550 hover:to-gray-450 text-white py-4 rounded-xl text-base font-semibold shadow-lg transition-all duration-300 hover:shadow-gray-600/25 disabled:opacity-50 disabled:cursor-not-allowed border-0"
                      >
                        {/* Removed white shimmer animation */}
                        <AnimatePresence mode="wait">
                          {isLoading ? (
                            <motion.div
                              key="loading"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center justify-center gap-3"
                            >
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Creating account...
                            </motion.div>
                          ) : (
                            <motion.span
                              key="button-text"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center justify-center gap-2"
                            >
                              Create Account
                              <ArrowRight className="w-4 h-4 group-hover/button:translate-x-1 transition-transform duration-300" />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </Button>
                    </motion.div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Switch form link */}
              <motion.div 
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-sm text-gray-400">
                  {activeTab === "login" 
                    ? "Don't have an account? " 
                    : "Already have an account? "
                  }
                  <motion.button
                    onClick={() => setActiveTab(activeTab === "login" ? "signup" : "login")}
                    disabled={isLoading}
                    className="relative inline-block group/signup"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10 text-gray-400 group-hover/signup:text-gray-300 transition-colors duration-300 font-medium">
                      {activeTab === "login" ? "Sign up" : "Sign in"}
                    </span>
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gray-400 group-hover/signup:w-full transition-all duration-300" />
                  </motion.button>
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
