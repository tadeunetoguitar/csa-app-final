import React from 'react';
import { Award, BookOpen, Download, ArrowDownCircle } from 'lucide-react';
import { UserProgress, ContentType, ContentBlock } from '../types';
import { EBOOK_CONTENT } from '../constants';
import jsPDF from 'jspdf';
import { Profile } from '../hooks/useProfile';

interface CompletionPageProps {
  onRestart: () => void;
  userData: UserProgress;
  profile: Profile | null;
}

export const CompletionPage: React.FC<CompletionPageProps> = ({ onRestart, userData, profile }) => {

  const handleScrollToAnswers = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const answersSection = document.getElementById('print-section');
    if (answersSection) {
      answersSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 50;
    const usableWidth = pageW - margin * 2;
    let y = margin;
    let pageNumber = 1;

    const addFooter = () => {
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(150, 150, 150);
      doc.text(`Página ${pageNumber}`, pageW - margin, pageH - 20, { align: 'right' });
    };

    const checkNewPage = (neededHeight: number) => {
      if (y + neededHeight > pageH - margin) {
        doc.addPage();
        pageNumber++;
        y = margin;
        addFooter();
        return true;
      }
      return false;
    };

    // --- First Page Header ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text('Como o Subconsciente Aprende!', margin, y);

    const today = new Date().toLocaleDateString('pt-BR');
    const userName = profile?.full_name || 'Usuário';
    const rightHeaderText = `${userName} | ${today}`;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(rightHeaderText, pageW - margin, y, { align: 'right' });
    y += 25;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageW - margin, y);
    y += 30;
    addFooter();

    let isFirstRenderedChapter = true;

    // --- Content Loop ---
    EBOOK_CONTENT.forEach(chapter => {
      const exerciseBlocks = chapter.blocks.filter(b => 
        [ContentType.EXERCISE, ContentType.INPUT_LIST, ContentType.CHECKLIST].includes(b.type) &&
        (userData[b.id!] || (b.type === ContentType.INPUT_LIST && (b.content as string[]).some((_, i) => userData[`${b.id}_${i}`])))
      );

      if (exerciseBlocks.length > 0) {
        if (!isFirstRenderedChapter) {
          y += 20; // Add extra top margin for subsequent chapters
        }

        checkNewPage(40);
        doc.setFont('times', 'bold');
        doc.setFontSize(18);
        doc.setTextColor(12, 74, 110);
        doc.text(chapter.title, margin, y);
        y += 25;

        exerciseBlocks.forEach(block => {
          checkNewPage(20);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(12);
          doc.setTextColor(30, 41, 59);
          const questionLines = doc.splitTextToSize(block.label!, usableWidth);
          doc.text(questionLines, margin, y);
          y += (questionLines.length * 12) + 5;

          let boxContent: { prompt?: string; answer: string }[] | undefined;
          if (block.type === ContentType.INPUT_LIST) {
            boxContent = (block.content as string[]).map((label, idx) => {
              const answer = userData[`${block.id}_${idx}`] as string;
              return answer ? { prompt: label, answer } : null;
            }).filter((item): item is { prompt: string; answer: string } => item !== null);
          } else if (block.type === ContentType.EXERCISE) {
            const answer = userData[block.id!] as string;
            if (answer) boxContent = [{ answer }];
          } else if (block.type === ContentType.CHECKLIST) {
            const selections = userData[block.id!] as string[] || [];
            if (selections.length > 0) boxContent = selections.map(item => ({ answer: `• ${item}` }));
          }

          if (!boxContent || boxContent.length === 0) return;

          const boxPadding = 15;
          const textWidthInsideBox = usableWidth - (boxPadding * 2);
          let boxContentH = boxPadding;

          boxContent.forEach(item => {
            if (item.prompt) {
              const promptLines = doc.splitTextToSize(item.prompt, textWidthInsideBox);
              boxContentH += (promptLines.length * 10) + 2;
            }
            const answerLines = doc.splitTextToSize(item.answer, textWidthInsideBox);
            boxContentH += (answerLines.length * 11) + 10;
          });
          boxContentH += boxPadding - 10;

          checkNewPage(boxContentH);
          
          doc.setFillColor(248, 250, 252);
          doc.setDrawColor(226, 232, 240);
          doc.rect(margin, y, usableWidth, boxContentH, 'FD');

          let itemY = y + boxPadding;
          boxContent.forEach(item => {
            if (item.prompt) {
              doc.setFontSize(10).setFont('helvetica', 'normal').setTextColor(100, 107, 119);
              const promptLines = doc.splitTextToSize(item.prompt, textWidthInsideBox);
              doc.text(promptLines, margin + boxPadding, itemY);
              itemY += (promptLines.length * 10) + 2;
            }
            
            doc.setFontSize(11).setFont('helvetica', 'bold').setTextColor(30, 41, 59);
            const answerLines = doc.splitTextToSize(item.answer, textWidthInsideBox);
            doc.text(answerLines, margin + boxPadding, itemY + 9);
            itemY += (answerLines.length * 11) + 10;
          });
          y += boxContentH + 20;
        });

        isFirstRenderedChapter = false;
      }
    });
    doc.save('minhas-respostas-subconsciente-aprende.pdf');
  };

  const renderAnswer = (block: ContentBlock) => {
    if (!block.id) return null;
    let answerContent;
    if (block.type === ContentType.EXERCISE) {
      const answer = userData[block.id] as string;
      if (!answer) return null;
      answerContent = <p className="text-slate-700 whitespace-pre-wrap">{answer}</p>;
    } else if (block.type === ContentType.INPUT_LIST) {
      const answers = (block.content as string[]).map((itemLabel, idx) => {
        const inputId = `${block.id}_${idx}`;
        const userAnswer = userData[inputId] as string;
        if (!userAnswer) return null;
        return (
          <div key={inputId} className="mt-2">
            <p className="text-slate-500">{itemLabel}</p>
            <p className="text-slate-800 font-medium pl-4 border-l-2 border-slate-200 mt-1">{userAnswer}</p>
          </div>
        );
      }).filter(Boolean);
      if (answers.length === 0) return null;
      answerContent = <div className="space-y-3">{answers}</div>;
    } else if (block.type === ContentType.CHECKLIST) {
      const selections = userData[block.id] as string[] || [];
      if (selections.length === 0) return null;
      answerContent = (
        <ul className="list-disc list-inside">
          {selections.map((item, idx) => <li key={idx} className="text-slate-700">{item}</li>)}
        </ul>
      );
    } else { return null; }

    return (
      <div className="mt-4">
        <h4 className="font-bold text-slate-800">{block.label}</h4>
        <div className="mt-2 p-4 bg-slate-50 rounded-lg border border-slate-200">
          {answerContent}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-full p-6 animate-fadeIn">
        <div className="max-w-2xl w-full">
          <div className="text-center bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-slate-200 no-print">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <Award className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">
              Parabéns por concluir sua jornada!
            </h1>
            <p className="mt-4 text-lg text-slate-600 leading-relaxed">
              Você deu um passo gigante na reprogramação da sua mente. Lembre-se: a transformação é um processo contínuo. Volte a estes exercícios sempre que precisar reforçar sua nova identidade. O poder de criar sua realidade está, e sempre esteve, dentro de você.
            </p>
            <div className="mt-8">
              <a
                href="#print-section"
                onClick={handleScrollToAnswers}
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-all font-medium"
              >
                <ArrowDownCircle className="w-5 h-5" />
                Veja suas respostas abaixo
              </a>
            </div>
          </div>

          <div id="print-section" className="mt-12 bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-slate-200">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8 border-b border-slate-200 pb-6">
              <h2 className="text-2xl font-serif font-bold text-slate-900">
                Suas Respostas
              </h2>
              <div className="flex gap-2 no-print">
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium text-sm"
                >
                  <Download className="w-4 h-4" />
                  Baixar PDF
                </button>
              </div>
            </div>
            
            <div className="space-y-10">
              {EBOOK_CONTENT.map(chapter => {
                const exercisesWithAnswers = chapter.blocks.filter(block => {
                  if (!block.id) return false;
                  if (block.type === ContentType.EXERCISE) return !!userData[block.id];
                  if (block.type === ContentType.INPUT_LIST) {
                    return (block.content as string[]).some((_, idx) => !!userData[`${block.id}_${idx}`]);
                  }
                  if (block.type === ContentType.CHECKLIST) return (userData[block.id] as string[] || []).length > 0;
                  return false;
                });

                if (exercisesWithAnswers.length === 0) return null;

                return (
                  <div key={chapter.id} className="print-chapter-title">
                    <h3 className="text-xl font-serif font-bold text-brand-800">{chapter.title}</h3>
                    <div className="space-y-4">
                      {exercisesWithAnswers.map(block => renderAnswer(block))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-10 text-center no-print">
            <button
              onClick={onRestart}
              className="flex items-center justify-center gap-2 w-full sm:w-auto mx-auto px-8 py-3 bg-brand-600 text-white rounded-xl shadow-lg shadow-brand-500/20 hover:bg-brand-700 hover:shadow-brand-500/30 transition-all active-scale-95 font-medium"
            >
              <BookOpen className="w-5 h-5" />
              Voltar ao Início
            </button>
          </div>
        </div>
      </div>
    </>
  );
};