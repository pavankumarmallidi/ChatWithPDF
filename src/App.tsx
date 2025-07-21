
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import ChatHistory from "@/pages/ChatHistory";
import ChatThread from "@/pages/ChatThread";
import NotFound from "@/pages/NotFound";
import { HelmetProvider } from "react-helmet-async";

const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/chat-history" element={<ChatHistory />} />
            <Route path="/chat/:chatId" element={<ChatThread />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
