import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChapterView } from './components/ChapterView';
import { LoginPage } from './components/LoginPage';
import { EBOOK_CONTENT } from './constants';
import { UserProgress, Chapter, ContentType } from './types';
import { Menu, Loader2 } from 'lucide-react';
import { Session } from '@supabase/supabase-js';
import { supabase } from './src/integrations/supabase/client';
import { useProfile, Profile } from './hooks/useProfile';
import { PurchasePage } from './components/PurchasePage';
import { ProfilePage } from './components/ProfilePage';
import { PurchaseSuccessPage } from './components/PurchaseSuccessPage';
import { CompletionPage } from './components/CompletionPage';

const STORAGE_KEY = 'ebook_reprogram_mind_data';
const ACTIVE_CHAPTER_KEY = 'ebook_active_chapter_id'; // Nova chave para o capítulo ativo
const RECOVERY_PENDING_KEY = 'supabase_recovery_pending'; // Chave para persistir o estado de recuperação

type ActiveView = 'chapters' | 'profile' | 'login' | 'purchase_success' | 'completion';

const isChapterExercisesComplete = (chapter: Chapter, userData: UserProgress): boolean => {
  const exerciseBlocks = chapter.blocks.filter(block =>
    [ContentType.EXERCISE, ContentType.INPUT_LIST, ContentType.CHECKLIST].includes(block.type) && !block.isOptional
  );

  if (exerciseBlocks.length === 0) {
    return true;
  }

  for (const block of exerciseBlocks) {
    if (!block.id) continue;

    if (block.type === ContentType.EXERCISE) {
      if (!userData[block.id] || (userData[block.id] as string).trim() === '') {
        return false;
      }
    } else if (block.type === ContentType.INPUT_LIST) {
      const content = block.content as string[];
      for (let i = 0; i < content.length; i++) {
        const inputId = `${block.id}_${i}`;
        if (!userData[inputId] || (userData[inputId] as string).trim() === '') {
          return false;
        }
      }
    } else if (block.type === ContentType.CHECKLIST) {
      const selections = (userData[block.id] as string[]) || [];
      const min = block.minSelections || 1;
      if (selections.length < min) {
        return false;
      }
    }
  }

  return true;
};

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const { profile, loading: profileLoading } = useProfile(session);
  
  // Inicializa com o capítulo salvo ou o primeiro capítulo
  const [currentChapterId, setCurrentChapterId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const savedChapterId = localStorage.getItem(ACTIVE_CHAPTER_KEY);
      const chapterExists = EBOOK_CONTENT.some(c => c.id === savedChapterId);
      return chapterExists ? savedChapterId! : EBOOK_CONTENT[0].id;
    }
    return EBOOK_CONTENT[0].id;
  });
  
  const [userData, setUserData] = useState<UserProgress>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  
  const [defaultView, setDefaultView] = useState<'purchase' | 'login'>('purchase');
  const [authCheckCompleted, setAuthCheckCompleted] = useState(false);
  
  const [activeView, setActiveView] = useState<ActiveView>('chapters');
  
  // Inicializa isPasswordRecovery baseado na URL ou LocalStorage
  const [isPasswordRecovery, setIsPasswordRecovery] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const isRecoveryLink = urlParams.get('type') === 'recovery' || hashParams.get('type') === 'recovery';
        const isPending = localStorage.getItem(RECOVERY_PENDING_KEY) === 'true';
        
        if (isRecoveryLink || isPending) {
            // Se detectado, garante que a flag esteja no storage para persistência
            localStorage.setItem(RECOVERY_PENDING_KEY, 'true');
            return true;
        }
    }
    return false;
  });
  
  const mainScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    
    // 1. Check for purchase success
    if (urlParams.get('purchase_success')) {
      setActiveView('purchase_success');
      window.history.replaceState({}, document.title, "/");
    }
    
    // Se isPasswordRecovery é true do inicializador, garante que a view seja 'profile'
    if (isPasswordRecovery) {
        setActiveView('profile');
    }

    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      setDefaultView('login');
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthCheckCompleted(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      
      // O evento PASSWORD_RECOVERY é o mais confiável
      if (event === 'PASSWORD_RECOVERY') {
        localStorage.setItem(RECOVERY_PENDING_KEY, 'true');
        setIsPasswordRecovery(true);
        setActiveView('profile');
      } else if (event === 'SIGNED_IN') {
        // Se logado, verifica se a recuperação está pendente (via localStorage)
        if (localStorage.getItem(RECOVERY_PENDING_KEY) === 'true') {
            // Mantém o estado de recuperação ativo para forçar a redefinição
            setIsPasswordRecovery(true);
            setActiveView('profile');
        } else {
            // Login normal
            setIsPasswordRecovery(false);
            setActiveView('chapters');
        }
      } else if (event === 'SIGNED_OUT') {
        // Limpa o estado de recuperação ao sair
        localStorage.removeItem(RECOVERY_PENDING_KEY);
        setIsPasswordRecovery(false);
      }
    });

    try {
      if (savedData) setUserData(JSON.parse(savedData));
    } catch (error) {
      console.warn("Error loading from localStorage:", error);
    }

    return () => subscription.unsubscribe();
  }, []);

  // Efeito para salvar o capítulo ativo sempre que ele mudar
  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_CHAPTER_KEY, currentChapterId);
    } catch (e) {
      console.warn("LocalStorage quota may be exceeded when saving active chapter.", e);
    }
  }, [currentChapterId]);

  useEffect(() => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentChapterId, activeView]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsSidebarOpen(false);
    setIsPasswordRecovery(false);
    localStorage.removeItem(RECOVERY_PENDING_KEY); // Limpa o estado de recuperação
    // Limpa o capítulo ativo ao sair
    localStorage.removeItem(ACTIVE_CHAPTER_KEY);
    setCurrentChapterId(EBOOK_CONTENT[0].id);
  };

  const handleUpdateData = (id: string, value: any) => {
    setUserData(prevUserData => {
      const newData = { ...prevUserData, [id]: value };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      } catch (e) {
        console.warn("LocalStorage quota may be exceeded.", e);
      }
      return newData;
    });
  };

  const currentChapterIndex = EBOOK_CONTENT.findIndex(c => c.id === currentChapterId);
  const currentChapter = EBOOK_CONTENT[currentChapterIndex];

  const isCurrentChapterComplete = currentChapter ? isChapterExercisesComplete(currentChapter, userData) : false;

  const completedChapterIds = EBOOK_CONTENT
    .filter(chapter => isChapterExercisesComplete(chapter, userData))
    .map(chapter => chapter.id);

  let highestUnlockedChapterIndex = EBOOK_CONTENT.length - 1;
  for (let i = 0; i < EBOOK_CONTENT.length; i++) {
    if (!isChapterExercisesComplete(EBOOK_CONTENT[i], userData)) {
      highestUnlockedChapterIndex = i;
      break;
    }
  }

  const handleNext = () => {
    const nextIndex = currentChapterIndex + 1;
    if (nextIndex < EBOOK_CONTENT.length) {
      setCurrentChapterId(EBOOK_CONTENT[nextIndex].id);
    }
  };

  const handlePrevious = () => {
    const prevIndex = currentChapterIndex - 1;
    if (prevIndex >= 0) {
      setCurrentChapterId(EBOOK_CONTENT[prevIndex].id);
    }
  };

  const navigateToProfile = () => {
    setActiveView('profile');
  };

  const handleBackFromProfile = () => {
    // Se a recuperação foi concluída (e o usuário foi deslogado em PasswordRecoveryView),
    // ele deve ir para o login.
    if (isPasswordRecovery) {
      setActiveView('login');
    } else {
      // Se foi apenas uma visita ao perfil, volta para os capítulos
      setActiveView('chapters');
    }
    setIsPasswordRecovery(false);
    localStorage.removeItem(RECOVERY_PENDING_KEY); // Limpa o estado de recuperação
  };

  const navigateToChapter = (chapterId: string) => {
    setCurrentChapterId(chapterId);
    setActiveView('chapters');
  };

  const navigateToCompletion = () => {
    setActiveView('completion');
  };

  const handleRestart = () => {
    setCurrentChapterId(EBOOK_CONTENT[0].id);
    setActiveView('chapters');
  };

  const getHeaderTitle = () => {
    if (!currentChapter) return '';
    switch(activeView) {
      case 'chapters':
        return currentChapter.title;
      case 'profile':
        return isPasswordRecovery ? 'Criar Nova Senha' : 'Minha Conta';
      case 'completion':
        return 'Jornada Concluída';
      default:
        return '';
    }
  };

  if (profileLoading || !authCheckCompleted) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  // Handle password recovery as a special, standalone view
  if (isPasswordRecovery && session) {
    return (
      <ProfilePage 
        session={session} 
        onBack={handleBackFromProfile} 
        isRecovery={true} 
      />
    );
  }

  if (activeView === 'purchase_success') {
    return <PurchaseSuccessPage onGoToLogin={() => setActiveView('login')} />;
  }

  if (session && profile?.has_access) {
    return (
      <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
        <Sidebar 
          currentChapterId={currentChapterId}
          onSelectChapter={navigateToChapter}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          completedChapters={completedChapterIds}
          onLogout={handleLogout}
          onNavigateToProfile={navigateToProfile}
          highestUnlockedChapterIndex={highestUnlockedChapterIndex}
        />
        <div className={`flex-1 flex flex-col h-full w-full relative transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-72' : 'lg:ml-0'}`}>
          <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between shadow-sm z-10">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-serif font-bold text-slate-800 text-sm truncate">
              {getHeaderTitle()}
            </span>
            <div className="w-6"></div>
          </div>
          <main 
            ref={mainScrollRef}
            className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth bg-white lg:bg-slate-50/50"
          >
            {activeView === 'chapters' && currentChapter && (
              <>
                <ChapterView 
                  chapter={currentChapter}
                  userData={userData}
                  onUpdateData={handleUpdateData}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                  isLast={currentChapterIndex === EBOOK_CONTENT.length - 1}
                  isFirst={currentChapterIndex === 0}
                  onComplete={navigateToCompletion}
                  isChapterComplete={isCurrentChapterComplete}
                />
                <footer className="py-8 text-center text-slate-400 text-xs">
                  <p>&copy; {new Date().getFullYear()} Como o Subconsciente Aprende.</p>
                </footer>
              </>
            )}
            {activeView === 'profile' && (
              <ProfilePage 
                session={session} 
                onBack={handleBackFromProfile} 
                isRecovery={isPasswordRecovery} 
              />
            )}
            {activeView === 'completion' && (
              <CompletionPage onRestart={handleRestart} userData={userData} profile={profile} />
            )}
          </main>
        </div>
      </div>
    );
  }
  
  if (activeView === 'login') {
    return <LoginPage />;
  }

  if (session && !profile?.has_access) {
    return <PurchasePage onGoToLogin={() => setActiveView('login')} />;
  }

  if (!session && defaultView === 'login') {
    return <LoginPage />;
  }

  return <PurchasePage onGoToLogin={() => setActiveView('login')} />;
};

export default App;