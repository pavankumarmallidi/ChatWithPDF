import { Card } from "@/components/ui/card";
import { FileText, Hash, Globe, BookOpen } from "lucide-react";

interface PdfAnalysisData {
  summary: string;
  totalPages: number;
  totalWords: number;
  language: string;
}

interface DocumentSidebarProps {
  pdfAnalysisData: PdfAnalysisData;
}

const DocumentSidebar = ({ pdfAnalysisData }: DocumentSidebarProps) => {
  return (
    <Card className="bg-gray-900/60 backdrop-blur-xl border-gray-800/50 shadow-2xl rounded-3xl overflow-hidden h-full">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-gray-700 to-gray-600 flex items-center justify-center shadow-lg shadow-gray-600/25 border border-gray-600/40">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Document Summary</h2>
        </div>
        
        <div className="space-y-4">
          {/* AI Summary */}
          <div className="p-4 rounded-2xl bg-gray-800/60 backdrop-blur-sm border border-gray-700/50">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-gray-400" />
              <h3 className="text-gray-300 font-semibold text-sm uppercase tracking-wide">AI Summary</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed font-light">
              {pdfAnalysisData.summary}
            </p>
          </div>
          
          {/* Document Stats */}
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-gray-800/60 to-gray-700/40 border border-gray-600/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300 text-sm font-medium">Total Pages</span>
                </div>
                <span className="text-gray-300 font-bold text-lg">{pdfAnalysisData.totalPages}</span>
              </div>
            </div>
            
            <div className="p-4 rounded-2xl bg-gradient-to-r from-gray-700/40 to-gray-800/60 border border-gray-600/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300 text-sm font-medium">Word Count</span>
                </div>
                <span className="text-gray-300 font-bold text-lg">{pdfAnalysisData.totalWords.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="p-4 rounded-2xl bg-gray-800/60 backdrop-blur-sm border border-gray-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300 text-sm font-medium">Language</span>
                </div>
                <span className="text-gray-300 font-semibold">{pdfAnalysisData.language}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DocumentSidebar;
