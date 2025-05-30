
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
    <Card className="bg-gray-900/50 backdrop-blur-xl border-gray-800 shadow-2xl rounded-3xl overflow-hidden h-full">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">Document Summary</h2>
        </div>
        
        <div className="space-y-4">
          {/* AI Summary */}
          <div className="p-4 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-orange-400" />
              <h3 className="text-orange-400 font-semibold text-sm uppercase tracking-wide">AI Summary</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              {pdfAnalysisData.summary}
            </p>
          </div>
          
          {/* Document Stats */}
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-orange-400" />
                  <span className="text-gray-300 text-sm">Total Pages</span>
                </div>
                <span className="text-orange-400 font-bold text-lg">{pdfAnalysisData.totalPages}</span>
              </div>
            </div>
            
            <div className="p-4 rounded-2xl bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-red-400" />
                  <span className="text-gray-300 text-sm">Word Count</span>
                </div>
                <span className="text-red-400 font-bold text-lg">{pdfAnalysisData.totalWords.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="p-4 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-orange-400" />
                  <span className="text-gray-300 text-sm">Language</span>
                </div>
                <span className="text-orange-400 font-semibold">{pdfAnalysisData.language}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DocumentSidebar;
