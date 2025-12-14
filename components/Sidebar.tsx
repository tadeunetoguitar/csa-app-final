import React from 'react';
import { EBOOK_CONTENT } from '../constants';
import { Brain, CheckCircle, LogOut, X, User, Lock } from 'lucide-react';

interface SidebarProps {
  currentChapterId: string;
  onSelectChapter: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
  completedChapters: string[];
  onLogout: () => void;
  onNavigateToProfile: () => void;
  highestUnlockedChapterIndex: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentChapterId, 
  onSelectChapter, 
  isOpen, 
  onClose,
  completedChapters,
  onLogout,
  onNavigateToProfile,
  highestUnlockedChapterIndex
}) => {
  
  // Helper function to check if we are on a mobile screen (less than 1024px, Tailwind's 'lg' breakpoint)
  const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 1024;

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-100 flex justify-between items-start">
            <div className="flex flex-col items-center w-full pr-6">
              <Brain className="w-6 h-6 text-brand-600 mb-2" />
              <h1 className="font-serif text-xl font-bold text-slate-800 text-center leading-tight">
                Como o<br />Subconsciente<br />Aprende!
              </h1>
              <p className="text-xs text-slate-500 mt-2 text-center">Reprogramação mental guiada.</p>
            </div>
            <button onClick={onClose} className="lg:hidden text-slate-500 mt-1 flex-shrink-0">
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {EBOOK_CONTENT.map((chapter, index) => {
              const isActive = currentChapterId === chapter.id;
              const isCompleted = completedChapters.includes(chapter.id);
              const isLocked = index > highestUnlockedChapterIndex;
              
              return (
                <button
                  key={chapter.id}
                  onClick={() => {
                    if (isLocked) return;
                    onSelectChapter(chapter.id);
                    // Só fecha o sidebar se estiver em modo mobile
                    if (isMobile()) {
                      onClose();
                    }
                  }}
                  disabled={isLocked}
                  className={`w-full flex items-start p-3 rounded-lg transition-colors duration-200 text-left group ${
                    isActive 
                      ? 'bg-brand-50 text-brand-900 shadow-sm ring-1 ring-brand-200' 
                      : isLocked
                      ? 'bg-slate-50 text-slate-400 cursor-not-allowed'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="mt-1 mr-3 flex-shrink-0">
                   {isLocked ? (
                     <Lock className="w-4 h-4 text-slate-400" />
                   ) : isCompleted ? (
                     <CheckCircle className="w-4 h-4 text-green-500" />
                   ) : (
                     <span className={`text-xs font-mono w-4 h-4 flex items-center justify-center rounded-full border ${isActive ? 'border-brand-500 text-brand-600' : 'border-slate-300 text-slate-400'}`}>
                       {index + 1}
                     </span>
                   )}
                  </div>
                  <div>
                    <span className={`block text-sm font-medium ${isActive ? 'text-brand-800' : isLocked ? 'text-slate-500' : 'text-slate-700'}`}>
                      {chapter.title}
                    </span>
                    {chapter.subtitle && (
                      <span className="block text-xs text-slate-400 mt-0.5 truncate max-w-[180px]">
                        {chapter.subtitle}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Progress and Logout */}
          <div className="p-4 bg-slate-50 border-t border-slate-200">
            <div className="text-xs text-slate-500 text-center mb-2">
              Progresso: {Math.round((completedChapters.length / EBOOK_CONTENT.length) * 100)}%
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mb-4 overflow-hidden">
              <div 
                className="bg-brand-500 h-full transition-all duration-500" 
                style={{ width: `${(completedChapters.length / EBOOK_CONTENT.length) * 100}%` }}
              />
            </div>

            <button 
              onClick={() => {
                onNavigateToProfile();
                // Só fecha o sidebar se estiver em modo mobile
                if (isMobile()) {
                  onClose();
                }
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors mb-2 border"
            >
              <User className="w-4 h-4" />
              Minha Conta
            </button>

            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100"
            >
              <LogOut className="w-4 h-4" />
              Sair da conta
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};