import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { User, Home, Power } from "lucide-react";

interface UserHeaderProps {
  getUserDisplayName: () => string;
  onHomeClick: () => void;
  onLogout: () => void;
}

const UserHeader = ({ getUserDisplayName, onHomeClick, onLogout }: UserHeaderProps) => {
  return (
    <div className="relative z-10 backdrop-blur-xl bg-gray-900/60 border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-gray-700 to-gray-600 rounded-2xl flex items-center justify-center shadow-lg shadow-gray-600/25 border border-gray-600/40">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Welcome back!</h2>
              <p className="text-gray-300 text-sm font-light">{getUserDisplayName()}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onHomeClick}
                  variant="outline"
                  size="icon"
                  className="bg-gray-800/60 border-gray-700/50 text-white hover:bg-gray-700/80 hover:border-gray-600/70 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-gray-600/20 rounded-xl"
                >
                  <Home className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-gray-900 border-gray-700 text-white">
                <p>Go to Home</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onLogout}
                  variant="outline"
                  size="icon"
                  className="bg-red-900/40 border-red-800/50 text-red-400 hover:bg-red-800/60 hover:border-red-700/70 hover:text-red-300 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-600/20 group rounded-xl"
                >
                  <Power className="w-4 h-4 group-hover:animate-pulse transition-transform group-hover:rotate-12" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-red-600 border-red-500 text-white">
                <p>Logout</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
