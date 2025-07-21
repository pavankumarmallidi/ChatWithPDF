import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  FileText, 
  Sparkles, 
  Brain, 
  Zap, 
  Shield, 
  ArrowRight,
  CheckCircle,
  Globe,
  Clock,
  Target,
  Menu,
  X
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Helmet } from "react-helmet-async";

interface HomePageProps {
  onGetStarted: () => void;
}

function HeroBackground() {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100vh',
      overflow: 'hidden',
    }}>
      {/* Premium dark black gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 20%, rgba(0, 0, 0, 0.9) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(10, 10, 15, 0.8) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(15, 15, 20, 0.9) 0%, transparent 50%),
            linear-gradient(135deg, #000000 0%, #0a0a0f 50%, #111111 100%)
          `
        }}
      />
      
      {/* Animated dark particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 bg-gray-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Dark overlay gradients */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          background: `
            linear-gradient(to right, rgba(0, 0, 0, 0.95), transparent 30%, transparent 70%, rgba(0, 0, 0, 0.95)),
            linear-gradient(to bottom, transparent 40%, rgba(0, 0, 0, 0.98))
          `,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

function Navbar({ onGetStarted }: { onGetStarted: () => void }) {
  const { user } = useAuth();
  const [hoveredNavItem, setHoveredNavItem] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMouseEnterNavItem = (item: string) => setHoveredNavItem(item);
  const handleMouseLeaveNavItem = () => setHoveredNavItem(null);

  const navLinkClass = (itemName: string, extraClasses = '') => {
    const isCurrentItemHovered = hoveredNavItem === itemName;
    const isAnotherItemHovered = hoveredNavItem !== null && !isCurrentItemHovered;

    const colorClass = isCurrentItemHovered
      ? 'text-white'
      : isAnotherItemHovered
        ? 'text-gray-600'
        : 'text-gray-300';

    return `text-sm font-medium transition duration-200 ${colorClass} ${extraClasses}`;
  };

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-20" 
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.9)', 
        backdropFilter: 'blur(20px)', 
        WebkitBackdropFilter: 'blur(20px)', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}
    >
      <div className="container mx-auto px-6 py-4 md:px-8 lg:px-12 flex items-center justify-between">
        <div className="flex items-center space-x-8 lg:space-x-12">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <div className="w-9 h-9 bg-gradient-to-br from-gray-800 to-black rounded-2xl flex items-center justify-center shadow-lg border border-gray-700/50">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-white tracking-tight">PDFOCREXTRACTOR</span>
          </motion.div>

          <div className="hidden lg:flex items-center space-x-8">
            <div className="relative group" onMouseEnter={() => handleMouseEnterNavItem('features')} onMouseLeave={handleMouseLeaveNavItem}>
              <a href="#features" className={navLinkClass('features', 'flex items-center')}>
                Features
                <svg className="ml-1 w-3 h-3 group-hover:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </a>
              <div className="absolute left-0 mt-2 w-48 bg-black/90 rounded-2xl shadow-xl py-2 border border-gray-800/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-30" 
                style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
                <a href="#features" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/30 transition duration-150 rounded-xl mx-1">AI Analysis</a>
                <a href="#features" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/30 transition duration-150 rounded-xl mx-1">OCR Technology</a>
                <a href="#features" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/30 transition duration-150 rounded-xl mx-1">Chat Interface</a>
              </div>
            </div>

            <a href="#how-it-works" className={navLinkClass('how-it-works')} onMouseEnter={() => handleMouseEnterNavItem('how-it-works')} onMouseLeave={handleMouseLeaveNavItem}>
              How it works
            </a>
            
            <a href="#benefits" className={navLinkClass('benefits')} onMouseEnter={() => handleMouseEnterNavItem('benefits')} onMouseLeave={handleMouseLeaveNavItem}>
              Benefits
            </a>
          </div>
        </div>

        <div className="flex items-center space-x-4 md:space-x-6">
          <a href="#" className="hidden md:block text-gray-300 hover:text-white text-sm font-medium transition duration-200">Support</a>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              onClick={onGetStarted}
              className="bg-gray-800/80 hover:bg-gray-700/90 text-white font-medium py-2.5 px-6 rounded-2xl text-sm border border-gray-700/50 transition-all duration-200 backdrop-blur-sm"
            >
              {user ? "Go to App" : "Start Free"}
            </Button>
          </motion.div>
          
          <button 
            className="lg:hidden text-gray-300 hover:text-white p-2 transition duration-200" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            aria-label="Toggle mobile menu"
          >
            <motion.div
              animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-black/90 border-t border-gray-800/50"
            style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
          >
            <div className="px-6 py-6 flex flex-col space-y-4">
              <a href="#features" className="text-gray-300 hover:text-white text-sm py-2 transition duration-200 font-medium rounded-xl hover:bg-gray-800/30 px-2" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white text-sm py-2 transition duration-200 font-medium rounded-xl hover:bg-gray-800/30 px-2" onClick={() => setIsMobileMenuOpen(false)}>How it works</a>
              <a href="#benefits" className="text-gray-300 hover:text-white text-sm py-2 transition duration-200 font-medium rounded-xl hover:bg-gray-800/30 px-2" onClick={() => setIsMobileMenuOpen(false)}>Benefits</a>
              <a href="#" className="text-gray-300 hover:text-white text-sm py-2 transition duration-200 font-medium rounded-xl hover:bg-gray-800/30 px-2" onClick={() => setIsMobileMenuOpen(false)}>Support</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function HeroContent({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <motion.div 
      className="text-left text-white pt-20 sm:pt-28 md:pt-36 px-6 max-w-5xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div 
        className="inline-flex items-center gap-2 bg-gray-800/30 border border-gray-700/30 rounded-full px-4 py-2 mb-8 backdrop-blur-sm"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Sparkles className="w-4 h-4 text-gray-400" />
        <span className="text-gray-200 text-sm font-medium">100% Free Forever • AI-powered document analysis</span>
      </motion.div>
      
      <motion.h1 
        className="text-5xl sm:text-7xl md:text-8xl font-bold mb-8 leading-[0.9] tracking-tight"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Transform your{" "}
        <br className="sm:hidden" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400">
          PDF workflow
        </span>
        <br className="sm:hidden" />
        {" "}to an art form.
      </motion.h1>
      
      <motion.p 
        className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-10 text-gray-300 max-w-3xl leading-relaxed font-light"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        Extract insights from your documents using advanced AI. Upload once – get comprehensive analysis, 
        summaries, and interactive chat capabilities on a single secure platform.
      </motion.p>
      
      <motion.div 
        className="flex pointer-events-auto flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button
            onClick={onGetStarted}
            className="bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white font-medium py-4 px-8 rounded-2xl transition duration-200 w-full sm:w-auto border border-gray-700/30 text-base backdrop-blur-sm shadow-lg hover:shadow-black/25"
          >
            Start Free Forever
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function ScreenshotSection({ screenshotRef }: { screenshotRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <section className="relative z-10 container mx-auto px-6 md:px-8 lg:px-12 mt-16 md:mt-20">
      <motion.div 
        ref={screenshotRef} 
        className="bg-gray-900/30 rounded-3xl overflow-hidden shadow-2xl border border-gray-800/30 w-full md:w-[85%] lg:w-[75%] mx-auto backdrop-blur-sm"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6 }}
      >
        <div className="p-6">
          <div className="bg-gradient-to-br from-gray-900/80 to-black/80 rounded-2xl p-8 relative overflow-hidden border border-gray-700/30">
            {/* Mock PDF interface */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gray-800/60 rounded-2xl flex items-center justify-center border border-gray-600/40">
                <FileText className="w-6 h-6 text-gray-200" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Sample_Document.pdf</h3>
                <p className="text-gray-400 text-sm">45 pages • 12,450 words • Processing complete</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800/40 rounded-2xl p-5 border border-gray-700/30">
                <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-gray-400" />
                  AI Summary
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  This document contains a comprehensive analysis of market trends, 
                  financial projections, and strategic recommendations for Q4 business growth...
                </p>
              </div>
              
              <div className="bg-gray-800/40 rounded-2xl p-5 border border-gray-700/30">
                <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gray-400" />
                  Key Insights
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle className="w-3 h-3 text-green-400/80" />
                    Revenue growth projected at 23%
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle className="w-3 h-3 text-green-400/80" />
                    Market expansion opportunities identified
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <span className="bg-gray-700/40 text-gray-300 px-3 py-1.5 rounded-full text-sm border border-gray-600/30">Business Report</span>
              <span className="bg-gray-700/40 text-gray-300 px-3 py-1.5 rounded-full text-sm border border-gray-600/30">English</span>
              <span className="bg-green-900/40 text-green-300 px-3 py-1.5 rounded-full text-sm border border-green-800/30">✓ Analyzed</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

const HomePage = ({ onGetStarted }: HomePageProps) => {
  const screenshotRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced AI algorithms extract and analyze content from your PDFs with unprecedented accuracy."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Process documents in seconds, not minutes. Get instant insights and summaries."
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your documents are processed securely with enterprise-grade encryption."
    },
    {
      icon: Globe,
      title: "Multi-Language Support",
      description: "Extract and analyze content from PDFs in multiple languages seamlessly."
    },
    {
      icon: Clock,
      title: "Real-time Processing",
      description: "Watch as your PDF is analyzed in real-time with live progress updates."
    },
    {
      icon: Target,
      title: "Precise Extraction",
      description: "Get accurate text extraction, word counts, and content summaries instantly."
    }
  ];

  const benefits = [
    "Extract text from any PDF document",
    "Get AI-powered summaries and insights",
    "Multi-language document support",
    "Real-time chat with your documents",
    "Secure cloud processing",
    "No software installation required"
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (screenshotRef.current && heroContentRef.current) {
        requestAnimationFrame(() => {
          const scrollPosition = window.pageYOffset;
          if (screenshotRef.current) {
            screenshotRef.current.style.transform = `translateY(-${scrollPosition * 0.3}px)`;
          }

          const maxScroll = 400;
          const opacity = 1 - Math.min(scrollPosition / maxScroll, 0.8);
          if (heroContentRef.current) {
            heroContentRef.current.style.opacity = opacity.toString();
          }
        });
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Helmet>
        <title>ChatWithPDF - Home</title>
        <meta name="description" content="Welcome to ChatWithPDF, your AI-powered PDF chat and extraction tool. Instantly search, summarize, and interact with your PDF documents." />
        <meta property="og:title" content="ChatWithPDF - Home" />
        <meta property="og:description" content="Welcome to ChatWithPDF, your AI-powered PDF chat and extraction tool. Instantly search, summarize, and interact with your PDF documents." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/favicon.svg" />
        <meta property="og:url" content="https://yourdomain.com/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ChatWithPDF - Home" />
        <meta name="twitter:description" content="Welcome to ChatWithPDF, your AI-powered PDF chat and extraction tool. Instantly search, summarize, and interact with your PDF documents." />
        <meta name="twitter:image" content="/favicon.svg" />
      </Helmet>
      <div className="relative bg-gradient-to-br from-black via-gray-900 to-gray-950">
        <Navbar onGetStarted={onGetStarted} />

        {/* Hero Section */}
        <div className="relative min-h-screen">
          <div className="absolute inset-0 z-0 pointer-events-auto">
            <HeroBackground />
          </div>

          <div 
            ref={heroContentRef}
            style={{
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100vh',
              display: 'flex', 
              justifyContent: 'flex-start', 
              alignItems: 'center', 
              zIndex: 10, 
              pointerEvents: 'none'
            }}
          >
            <div className="container mx-auto">
              <HeroContent onGetStarted={onGetStarted} />
            </div>
          </div>
        </div>

        {/* Content sections */}
        <div className="bg-black/90 relative z-10 backdrop-blur-sm" style={{ marginTop: '-10vh' }}>
          <ScreenshotSection screenshotRef={screenshotRef} />

          {/* Features Section */}
          <section id="features" className="py-32 px-6">
            <div className="max-w-7xl mx-auto">
              <motion.div 
                className="text-center mb-20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">Powerful Features</h2>
                <p className="text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed font-light">
                  Everything you need to extract, analyze, and interact with your PDF documents with precision and speed
                </p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02, y: -8 }}
                  >
                    <Card className="bg-gray-900/50 border-gray-800/50 backdrop-blur-sm hover:bg-gray-900/70 transition-all duration-300 h-full p-8 rounded-3xl">
                      <div className="w-14 h-14 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center mb-6 border border-gray-600/30 shadow-lg">
                        <feature.icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-2xl font-semibold text-white mb-4 tracking-tight">{feature.title}</h3>
                      <p className="text-gray-400 leading-relaxed text-lg font-light">{feature.description}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* How it Works Section */}
          <section id="how-it-works" className="py-32 px-6 bg-gray-900/30">
            <div className="max-w-6xl mx-auto">
              <motion.div 
                className="text-center mb-20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">How It Works</h2>
                <p className="text-gray-400 text-xl font-light leading-relaxed">Simple, fast, and powerful PDF analysis in three steps</p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {[
                  { step: "01", title: "Upload Your PDF", description: "Simply drag and drop your PDF file or click to upload. We support all standard PDF formats with enterprise-grade security.", icon: FileText },
                  { step: "02", title: "AI Analysis", description: "Our advanced AI processes your document, extracting text, analyzing content, and generating comprehensive insights in seconds.", icon: Brain },
                  { step: "03", title: "Interact & Export", description: "Chat with your document, get detailed summaries, ask specific questions, and export your analysis results.", icon: Sparkles }
                ].map((item, index) => (
                  <motion.div 
                    key={index} 
                    className="text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                  >
                    <div className="relative mb-8">
                      <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-900 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-gray-600/30 shadow-2xl">
                        <span className="text-white font-bold text-xl">{item.step}</span>
                      </div>
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gray-600/20 to-gray-800/10 blur-xl mx-auto w-24 h-24" />
                    </div>
                    <item.icon className="w-10 h-10 text-gray-400 mx-auto mb-6" />
                    <h3 className="text-2xl font-semibold text-white mb-4 tracking-tight">{item.title}</h3>
                    <p className="text-gray-400 text-lg leading-relaxed font-light">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section id="benefits" className="py-32 px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 tracking-tight leading-tight">Why Choose PDFOCREXTRACTOR?</h2>
                  <p className="text-gray-400 text-xl mb-12 leading-relaxed font-light">
                    Transform how you work with documents. Our AI-powered platform makes PDF analysis faster, 
                    more accurate, and incredibly user-friendly.
                  </p>
                  
                  <div className="space-y-6 mb-12">
                    {benefits.map((benefit, index) => (
                      <motion.div 
                        key={index} 
                        className="flex items-center gap-4"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <CheckCircle className="w-6 h-6 text-green-400/80 flex-shrink-0" />
                        <span className="text-gray-300 text-lg font-light">{benefit}</span>
                      </motion.div>
                    ))}
                  </div>
                  
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button 
                      onClick={onGetStarted}
                      className="bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white border border-gray-700/30 px-10 py-4 text-lg font-medium rounded-2xl transition-all duration-200 backdrop-blur-sm shadow-lg hover:shadow-black/25"
                    >
                      Get Started Free <ArrowRight className="w-5 h-5 ml-3" />
                    </Button>
                  </motion.div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-gray-900/50 border-gray-800/50 backdrop-blur-sm p-10 rounded-3xl">
                    <div className="space-y-8">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-gray-700/60 rounded-2xl flex items-center justify-center border border-gray-600/40">
                          <FileText className="w-7 h-7 text-gray-300" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold text-xl">Sample_Document.pdf</h3>
                          <p className="text-gray-400 text-base">45 pages • 12,450 words</p>
                        </div>
                      </div>
                      
                      <div className="bg-gray-800/40 rounded-2xl p-6 border border-gray-700/30">
                        <h4 className="text-white font-medium mb-3 text-lg">AI Summary</h4>
                        <p className="text-gray-300 leading-relaxed">
                          This document contains a comprehensive analysis of market trends, 
                          financial projections, and strategic recommendations for sustainable growth...
                        </p>
                      </div>
                      
                      <div className="flex gap-3">
                        <span className="bg-gray-700/40 text-gray-300 px-4 py-2 rounded-full text-sm border border-gray-600/30 font-medium">Business Report</span>
                        <span className="bg-gray-700/40 text-gray-300 px-4 py-2 rounded-full text-sm border border-gray-600/30 font-medium">English</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-32 px-6 text-center bg-gradient-to-br from-gray-900/40 to-black/30">
            <motion.div 
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 tracking-tight leading-tight">Ready to Analyze Your PDFs?</h2>
              <p className="text-gray-400 text-xl mb-12 font-light leading-relaxed max-w-2xl mx-auto">
                Join thousands of users who trust PDFOCREXTRACTOR for their document processing needs.
              </p>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button 
                  onClick={onGetStarted}
                  size="lg"
                  className="bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white border border-gray-700/30 px-12 py-5 text-xl font-medium rounded-2xl transition-all duration-200 backdrop-blur-sm shadow-lg hover:shadow-black/25"
                >
                  Start Analyzing Now <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </motion.div>
            </motion.div>
          </section>
        </div>
      </div>
    </>
  );
};

export default HomePage;
