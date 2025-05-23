
import { Menu, PenSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onApiKeyChange: (apiKey: string) => void;
}

const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const handleNewChat = () => {
    window.location.reload();
  };

  return (
    <div className={cn(
      "fixed top-0 left-0 z-40 h-screen bg-chatgpt-sidebar transition-all duration-300",
      isOpen ? "w-64" : "w-0"
    )}>
      <nav className="flex h-full w-full flex-col px-3" aria-label="Chat history">
        <div className="flex justify-between flex h-[60px] items-center">
          <button onClick={onToggle} className="h-10 rounded-lg px-2 text-token-text-secondary hover:bg-token-sidebar-surface-secondary">
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {isOpen && (
          <div className="flex-col flex-1 transition-opacity duration-500">
            <button 
              className="flex items-center justify-center rounded-lg border border-white/20 p-3 hover:bg-gray-500/10 transition-colors"
              onClick={handleNewChat}
            >
              <PenSquare className="h-5 w-5" />
            </button>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
