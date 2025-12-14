import React, { useState, useEffect } from 'react';
import { Chapter, ContentType, UserProgress } from '../types';
import { ChevronRight, ChevronLeft, Save, Play, CheckSquare, Square, Loader2, Sparkles, RefreshCw, AlertCircle, Trash2, Check } from 'lucide-react';

interface ChapterViewProps {
  chapter: Chapter;
  userData: UserProgress;
  onUpdateData: (id: string, value: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  isLast: boolean;
  isFirst: boolean;
  onComplete: () => void;
  isChapterComplete: boolean;
}

export const ChapterView: React.FC<ChapterViewProps> = ({ 
  chapter, 
  userData, 
  onUpdateData, 
  onNext, 
  onPrevious,
  isLast,
  isFirst,
  onComplete,
  isChapterComplete
}) => {
  const [justSaved, setJustSaved] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  useEffect(() => {
    setGenerationError(null);
    const imageKey = `img_${chapter.id}`;
    const savedImage = userData[imageKey];
    
    setIsGenerating(false);

    if (savedImage && typeof savedImage === 'string') {
      setGeneratedImage(savedImage);
    } else if (chapter.imagePrompt) {
      setGeneratedImage(null);
      const debounceTimer = setTimeout(() => {
        generatePollinationsImage(chapter.imagePrompt!, imageKey);
      }, 800);
      
      return () => clearTimeout(debounceTimer);
    } else {
      setGeneratedImage(null);
    }
  }, [chapter.id, chapter.imagePrompt, userData]);

  const generatePollinationsImage = (prompt: string, storageKey: string, retryWithRandomSeed = false) => {
    if (userData[storageKey] && !retryWithRandomSeed) return;

    setIsGenerating(true);
    setGenerationError(null);

    let seed = chapter.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    if (retryWithRandomSeed) {
        seed = Math.floor(Math.random() * 10000);
    }
    
    const encodedPrompt = encodeURIComponent(prompt + ", cinematic lighting, high quality, masterpiece");
    let imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=576&seed=${seed}&nologo=true`;

    if (retryWithRandomSeed) {
        imageUrl += "&model=flux";
    }

    const img = new Image();
    img.src = imageUrl;
    
    img.onload = () => {
      setGeneratedImage(imageUrl);
      onUpdateData(storageKey, imageUrl);
      setIsGenerating(false);
    };

    img.onerror = () => {
      console.error("Error loading image from Pollinations");
      
      if (!retryWithRandomSeed) {
        console.log("Retrying with random seed and flux model...");
        generatePollinationsImage(prompt, storageKey, true);
      } else {
        setGenerationError("Não foi possível carregar a visualização.");
        setIsGenerating(false);
      }
    };
  };

  const handleManualRetry = () => {
    if (chapter.imagePrompt) {
        const imageKey = `img_${chapter.id}`;
        generatePollinationsImage(chapter.imagePrompt, imageKey, true);
    }
  };

  const handleSaveInput = (id: string, value: string) => {
    onUpdateData(id, value);
    setJustSaved(id);
    setTimeout(() => setJustSaved(null), 2000);
  };

  const toggleChecklist = (id: string, item: string, maxSelections?: number) => {
    const current = (userData[id] as string[]) || [];
    const isSelected = current.includes(item);

    if (!isSelected && maxSelections && current.length >= maxSelections) {
      return;
    }

    const newSelection = isSelected
      ? current.filter(i => i !== item)
      : [...current, item];
    onUpdateData(id, newSelection);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 lg:py-16 animate-fadeIn">
      
      <div className="mb-10 rounded-2xl overflow-hidden shadow-lg aspect-video relative group bg-slate-900 flex items-center justify-center">
        {generatedImage ? (
          <>
            <img 
              src={generatedImage} 
              alt={chapter.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={() => {
                  setGeneratedImage(null);
                  setGenerationError("Imagem indisponível");
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
            <button 
                onClick={handleManualRetry}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                title="Gerar nova variante"
            >
                <RefreshCw className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="text-center p-6 relative z-10 w-full">
             {isGenerating ? (
               <div className="flex flex-col items-center gap-3">
                 <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
                 <p className="text-brand-100 font-medium text-sm animate-pulse">Criando visualização...</p>
                 <p className="text-slate-500 text-xs max-w-md mx-auto line-clamp-2 px-4">"{chapter.imagePrompt}"</p>
               </div>
             ) : generationError ? (
                <div className="flex flex-col items-center gap-3">
                    <AlertCircle className="w-8 h-8 text-red-400" />
                    <p className="text-red-200 text-sm font-medium">{generationError}</p>
                    <button 
                        onClick={handleManualRetry}
                        className="mt-2 text-xs text-brand-400 hover:text-brand-300 underline"
                    >
                        Carregar imagem
                    </button>
                </div>
             ) : (
                <div className="flex flex-col items-center gap-2 opacity-50">
                   <Sparkles className="w-8 h-8 text-slate-400" />
                   <p className="text-slate-400 text-sm">Visualização</p>
                   <button 
                        onClick={handleManualRetry}
                        className="mt-2 text-xs text-brand-400 hover:text-brand-300 underline"
                    >
                        Carregar imagem
                    </button>
                </div>
             )}
          </div>
        )}
      </div>

      <header className="mb-10 border-b border-slate-200 pb-6">
        <span className="text-brand-600 font-bold tracking-wider text-xs uppercase mb-2 block">
          Reprogramando a Mente
        </span>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-3">
          {chapter.title}
        </h1>
        {chapter.subtitle && (
          <h2 className="text-xl text-slate-500 font-light">
            {chapter.subtitle}
          </h2>
        )}
      </header>

      <div className="space-y-8">
        {chapter.blocks.map((block, index) => {
          switch (block.type) {
            case ContentType.TEXT:
              const content = block.content as string;
              const isActionStep = content.startsWith('[ACTION_STEP]');
              const displayContent = isActionStep ? content.substring('[ACTION_STEP]'.length).trim() : content;

              if (isActionStep) {
                return (
                  <div key={index} className="my-8">
                    <div className="flex items-center gap-3 p-4 bg-brand-50 border border-brand-200 rounded-xl shadow-md">
                      <Play className="w-6 h-6 text-brand-600 flex-shrink-0" />
                      <p className="text-lg font-bold text-brand-800">
                        {displayContent}
                      </p>
                    </div>
                  </div>
                );
              }

              return (
                <p 
                  key={index} 
                  className="text-slate-700 leading-relaxed text-lg"
                  dangerouslySetInnerHTML={{ __html: displayContent }}
                />
              );
            
            case ContentType.QUOTE:
              return (
                <blockquote key={index} className="border-l-4 border-brand-400 pl-6 py-2 my-8 bg-brand-50/50 rounded-r-lg">
                  <p 
                    className="text-xl font-serif italic text-brand-900"
                    dangerouslySetInnerHTML={{ __html: `"${block.content}"` }}
                  />
                </blockquote>
              );

            case ContentType.LIST:
              return (
                <ul key={index} className="space-y-3 my-6">
                  {(block.content as string[]).map((item, idx) => {
                    const isCheckItem = item.trim().startsWith('✓');
                    const displayItem = isCheckItem ? item.trim().substring(1).trim() : item;

                    return (
                      <li key={idx} className="flex items-start gap-3 text-slate-700">
                        {isCheckItem ? (
                          <Check className="mt-1 w-5 h-5 text-green-600 flex-shrink-0" />
                        ) : (
                          <span className="mt-2 w-1.5 h-1.5 bg-brand-500 rounded-full flex-shrink-0" />
                        )}
                        <span 
                          className="leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: displayItem }}
                        />
                      </li>
                    );
                  })}
                </ul>
              );

            case ContentType.SUBHEADER:
              return (
                <h3 
                  key={index} 
                  className="text-2xl font-bold text-slate-800 mt-10 mb-4 font-serif"
                  dangerouslySetInnerHTML={{ __html: block.content as string }}
                />
              );

            case ContentType.EXERCISE:
              return (
                <div key={index} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm my-8 ring-1 ring-slate-100">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2 text-brand-700 font-bold uppercase text-xs tracking-wide">
                      <Play className="w-4 h-4" />
                      Exercício Prático
                    </div>
                    {block.id && userData[block.id] && (
                      <button
                        onClick={() => onUpdateData(block.id!, '')}
                        className="flex items-center gap-2 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors px-3 py-1 rounded-md font-medium"
                        title="Limpar resposta"
                      >
                        <Trash2 className="w-4 h-4" />
                        Limpar
                      </button>
                    )}
                  </div>
                  {block.label && (
                    <h4 className="font-bold text-slate-900 text-lg mb-3">
                      {block.label}
                    </h4>
                  )}
                  {block.content && (
                     <p className="text-slate-600 text-sm mb-4 italic">{block.content}</p>
                  )}
                  {block.id && (
                    <div className="relative group">
                      <textarea
                        className="w-full min-h-[160px] p-4 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                        placeholder={block.placeholder}
                        value={(userData[block.id] as string) || ''}
                        onChange={(e) => handleSaveInput(block.id!, e.target.value)}
                      />
                      <div className={`absolute bottom-4 right-4 transition-opacity duration-300 ${justSaved === block.id ? 'opacity-100' : 'opacity-0'}`}>
                        <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">
                          <Save className="w-3 h-3" /> Salvo
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );

            case ContentType.INPUT_LIST:
              const inputIds = (block.content as string[]).map((_, idx) => `${block.id}_${idx}`);
              const hasData = inputIds.some(id => userData[id]);

              return (
                <div key={index} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm my-8 ring-1 ring-slate-100">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2 text-brand-700 font-bold uppercase text-xs tracking-wide">
                      <Play className="w-4 h-4" />
                      Exercício Prático
                    </div>
                    {hasData && (
                      <button
                        onClick={() => inputIds.forEach(id => onUpdateData(id, ''))}
                        className="flex items-center gap-2 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors px-3 py-1 rounded-md font-medium"
                        title="Limpar todas as respostas"
                      >
                        <Trash2 className="w-4 h-4" />
                        Limpar
                      </button>
                    )}
                  </div>
                  {block.label && (
                    <h4 className="font-bold text-slate-900 text-lg mb-3">
                      {block.label}
                    </h4>
                  )}
                  {block.placeholder && (
                     <p className="text-slate-600 text-sm mb-6 italic">{block.placeholder}</p>
                  )}
                  <div className={`${block.inputType === 'textarea' ? 'space-y-6' : 'space-y-3'}`}>
                    {(block.content as string[]).map((itemLabel, idx) => {
                      const inputId = `${block.id}_${idx}`;
                      
                      if (block.inputType === 'textarea') {
                        return (
                           <div key={idx} className="group relative">
                             <label className="block text-sm font-medium text-slate-800 mb-2 leading-relaxed">
                               {idx + 1}. {itemLabel}
                             </label>
                             <div className="relative">
                                <textarea
                                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none min-h-[100px]"
                                  placeholder="Digite sua resposta aqui..."
                                  value={(userData[inputId] as string) || ''}
                                  onChange={(e) => handleSaveInput(inputId, e.target.value)}
                                />
                                <div className={`absolute bottom-3 right-3 transition-opacity duration-300 ${justSaved === inputId ? 'opacity-100' : 'opacity-0'}`}>
                                    <Save className="w-4 h-4 text-green-500" />
                                </div>
                             </div>
                           </div>
                        );
                      }

                      return (
                        <div key={idx} className="flex items-center gap-3 group relative">
                          <span className="text-slate-400 font-mono text-sm w-8 text-right flex-shrink-0 pt-3">{idx + 1}.</span>
                          <div className="flex-1 relative">
                            <input
                              type="text"
                              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                              placeholder={itemLabel}
                              value={(userData[inputId] as string) || ''}
                              onChange={(e) => handleSaveInput(inputId, e.target.value)}
                            />
                            <div className={`absolute top-1/2 -translate-y-1/2 right-3 transition-opacity duration-300 ${justSaved === inputId ? 'opacity-100' : 'opacity-0'}`}>
                                <Save className="w-4 h-4 text-green-500" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );

            case ContentType.CHECKLIST:
               const currentSelections = (userData[block.id!] as string[]) || [];
               const hasSelections = currentSelections.length > 0;

               return (
                 <div key={index} className="bg-slate-50 rounded-xl p-6 my-8 border border-slate-200">
                    <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="flex items-center gap-2 text-brand-700 font-bold uppercase text-xs tracking-wide">
                            <Play className="w-4 h-4" />
                            Exercício Prático
                        </div>
                        {hasSelections && (
                          <button
                            onClick={() => onUpdateData(block.id!, [])}
                            className="flex items-center gap-2 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors px-3 py-1 rounded-md font-medium flex-shrink-0 ml-4"
                            title="Limpar seleção"
                          >
                            <Trash2 className="w-4 h-4" />
                            Limpar
                          </button>
                        )}
                    </div>
                    {block.label && <h4 className="font-bold text-slate-800 mb-4">{block.label}</h4>}
                    <div className="space-y-3">
                      {(block.content as string[]).map((item, idx) => {
                        const isChecked = currentSelections.includes(item);
                        const isLimitReached = block.maxSelections ? currentSelections.length >= block.maxSelections : false;
                        const isDisabled = !isChecked && isLimitReached;

                        return (
                          <button 
                            key={idx}
                            onClick={() => toggleChecklist(block.id!, item, block.maxSelections)}
                            disabled={isDisabled}
                            className={`flex items-center gap-3 w-full text-left p-2 rounded-lg transition-colors group ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white'}`}
                          >
                            {isChecked ? (
                              <CheckSquare className="w-5 h-5 text-brand-600 flex-shrink-0" />
                            ) : (
                              <Square className="w-5 h-5 text-slate-400 group-hover:text-brand-500 flex-shrink-0" />
                            )}
                            <span className={`${isChecked ? 'text-slate-800 font-medium line-through decoration-slate-300' : 'text-slate-600'}`}>
                              {item}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {(block.minSelections || block.maxSelections) && (
                        <p className="text-xs text-slate-400 mt-3 italic">
                           {(() => {
                              if (block.minSelections && block.maxSelections && block.minSelections === block.maxSelections) {
                                return `Selecione exatamente ${block.minSelections} opções.`;
                              }
                              if (block.minSelections && block.maxSelections) {
                                return `Selecione entre ${block.minSelections} e ${block.maxSelections} opções.`;
                              }
                              if (block.minSelections) {
                                return `Selecione no mínimo ${block.minSelections} opções.`;
                              }
                              if (block.maxSelections) {
                                return `Selecione no máximo ${block.maxSelections} opções.`;
                              }
                           })()}
                        </p>
                    )}
                 </div>
               );

            default:
              return null;
          }
        })}
      </div>

      <div className="mt-16 pt-8 border-t border-slate-200">
        {!isChapterComplete && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3 text-sm text-yellow-800">
            <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Ação necessária</p>
              <p className="mt-1">Você precisa completar todos os exercícios deste capítulo para poder avançar.</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-4">
          {!isFirst ? (
            <button
              onClick={onPrevious}
              className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all font-medium"
            >
              <ChevronLeft className="w-5 h-5" />
              Anterior
            </button>
          ) : (
            <div /> // Spacer
          )}

          {!isLast ? (
            <div className="relative group">
              <button
                onClick={onNext}
                disabled={!isChapterComplete}
                className="flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl shadow-lg shadow-brand-500/20 hover:bg-brand-700 hover:shadow-brand-500/30 transition-all active:scale-95 font-medium disabled:bg-slate-400 disabled:shadow-none disabled:cursor-not-allowed"
              >
                Próximo
                <ChevronRight className="w-5 h-5" />
              </button>
              {!isChapterComplete && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1.5 bg-slate-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Complete os exercícios para avançar
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                </div>
              )}
            </div>
          ) : (
            <div className="relative group">
              <button
                onClick={onComplete}
                disabled={!isChapterComplete}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl shadow-lg shadow-green-500/20 hover:bg-green-700 hover:shadow-green-500/30 transition-all active:scale-95 font-medium disabled:bg-slate-400 disabled:shadow-none disabled:cursor-not-allowed"
              >
                <Sparkles className="w-5 h-5" />
                Concluir Jornada
              </button>
              {!isChapterComplete && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1.5 bg-slate-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Complete os exercícios para concluir
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};