import { useState } from "react";
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
  Target
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface HomePageProps {
  onGetStarted: () => void;
}

const HomePage = ({ onGetStarted }: HomePageProps) => {
  const { user } = useAuth();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] relative overflow-hidden">
      {/* Background decoration */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234f46e5' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#4169E1] to-[#5578F0] rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-lg font-bold text-white">PDF Analyzer</h1>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors text-sm">Features</a>
            <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors text-sm">How it works</a>
            <a href="#benefits" className="text-gray-300 hover:text-white transition-colors text-sm">Benefits</a>
            <Button
              onClick={onGetStarted}
              variant="outline"
              size="sm"
              className="border-[#4169E1] text-[#4169E1] hover:bg-[#4169E1] hover:text-white text-sm"
            >
              {user ? "Go to App" : "Log in"}
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 text-center py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#4169E1]/10 border border-[#4169E1]/20 rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-[#4169E1]" />
            <span className="text-[#4169E1] text-sm font-medium">AI vs. Manual: Find out who wins during live analysis</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Got a PDF? <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4169E1] to-[#5578F0]">Analyze it today</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Extract insights from your documents using advanced AI. 
            Upload once – get comprehensive analysis, summaries, and interactive chat capabilities.
          </p>

          <Button 
            onClick={onGetStarted}
            className="bg-gradient-to-r from-[#4169E1] to-[#5578F0] hover:from-[#3457DA] hover:to-[#4E6EEF] text-white border-0 px-8 py-6 text-lg mb-8"
          >
            Start for free. No credit card required.
          </Button>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {["PDF Extractor", "Document Analyzer", "AI Summarizer", "Content Chat"].map((tag) => (
              <span key={tag} className="bg-[#1e1e1e]/30 border border-gray-600 rounded-full px-4 py-2 text-gray-300 text-sm backdrop-blur-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Everything you need to extract, analyze, and interact with your PDF documents
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-[#1e1e1e]/50 border-gray-700 backdrop-blur-sm hover:bg-[#1e1e1e]/70 transition-all duration-300 hover:scale-105">
                <div className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#4169E1] to-[#5578F0] rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="relative z-10 py-20 px-6 bg-[#0a0a0a]/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-gray-300 text-lg">Simple, fast, and powerful PDF analysis in three steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Upload Your PDF", description: "Simply drag and drop your PDF file or click to upload. We support all standard PDF formats." },
              { step: "02", title: "AI Analysis", description: "Our advanced AI processes your document, extracting text, analyzing content, and generating insights." },
              { step: "03", title: "Interact & Export", description: "Chat with your document, get summaries, ask questions, and export your analysis results." }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[#4169E1] to-[#5578F0] rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white font-bold text-lg">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="relative z-10 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">Why Choose PDF Analyzer?</h2>
              <p className="text-gray-300 text-lg mb-8">
                Transform how you work with documents. Our AI-powered platform makes PDF analysis faster, 
                more accurate, and incredibly user-friendly.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#4169E1]" />
                    <span className="text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <Button 
                onClick={onGetStarted}
                className="mt-8 bg-gradient-to-r from-[#4169E1] to-[#5578F0] hover:from-[#3457DA] hover:to-[#4E6EEF] text-white border-0 px-8 py-6 text-lg"
              >
                Get Started Free <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            
            <div className="relative">
              <Card className="bg-[#1e1e1e]/50 border-gray-700 backdrop-blur-sm p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#4169E1] rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Sample_Document.pdf</h3>
                      <p className="text-gray-400 text-sm">45 pages • 12,450 words</p>
                    </div>
                  </div>
                  
                  <div className="bg-[#0a0a0a]/50 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">AI Summary</h4>
                    <p className="text-gray-300 text-sm">
                      This document contains a comprehensive analysis of market trends, 
                      financial projections, and strategic recommendations...
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <span className="bg-[#4169E1]/20 text-[#4169E1] px-3 py-1 rounded-full text-sm">Business Report</span>
                    <span className="bg-[#5578F0]/20 text-[#5578F0] px-3 py-1 rounded-full text-sm">English</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Analyze Your PDFs?</h2>
          <p className="text-gray-300 text-lg mb-8">
            Join thousands of users who trust PDF Analyzer for their document processing needs.
          </p>
          <Button 
            onClick={onGetStarted}
            size="lg"
            className="bg-gradient-to-r from-[#4169E1] to-[#5578F0] hover:from-[#3457DA] hover:to-[#4E6EEF] text-white border-0 px-12 py-6 text-lg"
          >
            Start Analyzing Now <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
