
import React from 'react';
import { WordAnalysis, RelatedWord, ContextExample, Morphology } from '../types';
import BookOpenIcon from './icons/BookOpenIcon';
import QuoteIcon from './icons/QuoteIcon';
import UsersIcon from './icons/UsersIcon';
import AtomIcon from './icons/AtomIcon';
import LinkIcon from './icons/LinkIcon';
import SwapIcon from './icons/SwapIcon';

interface LearningStepsProps {
  analysis: WordAnalysis;
  isLoadingDetails: boolean;
}

interface StepCardProps {
  icon: React.ReactNode;
  title: string;
  step: number;
  children: React.ReactNode;
}

const StepCard: React.FC<StepCardProps> = ({ icon, title, step, children }) => (
  <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
    <div className="flex items-center mb-4">
      <div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded-full mr-4 text-blue-600 dark:text-blue-300">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Step {step}</h3>
        <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</p>
      </div>
    </div>
    <div className="text-slate-600 dark:text-slate-300 space-y-4 text-lg leading-relaxed">
      {children}
    </div>
  </div>
);

const SkeletonCard: React.FC<{ icon: React.ReactNode; title: string; step: number; }> = ({ icon, title, step }) => (
    <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
        <div className="flex items-center mb-4">
            <div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded-full mr-4 text-blue-600 dark:text-blue-300">
                {icon}
            </div>
            <div>
                <h3 className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Step {step}</h3>
                <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</p>
            </div>
        </div>
        <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
        </div>
    </div>
);


const MorphologyDisplay: React.FC<{ morphology: Morphology }> = ({ morphology }) => (
    <div className="flex flex-wrap gap-x-6 gap-y-2">
        {morphology.prefix && <div><span className="font-mono text-blue-500 dark:text-blue-400">{morphology.prefix.part}-</span><span className="text-sm"> ({morphology.prefix.meaning})</span></div>}
        {morphology.root && <div><span className="font-mono text-red-500 dark:text-red-400">{morphology.root.part}</span><span className="text-sm"> ({morphology.root.meaning})</span></div>}
        {morphology.suffix && <div><span className="font-mono text-green-500 dark:text-green-400">-{morphology.suffix.part}</span><span className="text-sm"> ({morphology.suffix.meaning})</span></div>}
    </div>
);

const ContextDisplay: React.FC<{ example: ContextExample }> = ({ example }) => (
    <div className="border-l-4 border-slate-200 dark:border-slate-700 pl-4">
        <p className="italic">"{example.content}"</p>
        {example.source && <p className="text-right text-sm text-slate-500 mt-1">— {example.source}</p>}
    </div>
);


const LearningSteps: React.FC<LearningStepsProps> = ({ analysis, isLoadingDetails }) => {
  return (
    <div className="space-y-6">
      <StepCard icon={<BookOpenIcon />} title="Precise Definition" step={1}>
        <p>
            <strong className="font-semibold text-slate-900 dark:text-white">{analysis.distilledDefinition}</strong>
            <em className="ml-2 text-slate-500 dark:text-slate-400">({analysis.partOfSpeech})</em>
        </p>
      </StepCard>

      {isLoadingDetails ? (
        <>
            <SkeletonCard icon={<QuoteIcon />} title="Contextual Habitat" step={2} />
            <SkeletonCard icon={<UsersIcon />} title="Personal Connection" step={3} />
            <SkeletonCard icon={<AtomIcon />} title="Morphology & Etymology" step={4} />
            <SkeletonCard icon={<LinkIcon />} title="Semantic Chunking" step={5} />
        </>
      ) : (
        <>
            {analysis.contextExamples && (
                 <StepCard icon={<QuoteIcon />} title="Contextual Habitat" step={2}>
                    {analysis.contextExamples.map((ex, i) => <ContextDisplay key={i} example={ex} />)}
                     <div className="pt-4">
                        <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Common Collocates:</h4>
                        <div className="flex flex-wrap gap-2">
                            {analysis.collocates?.map(c => <span key={c} className="bg-slate-200 dark:bg-slate-700 text-sm font-medium px-2 py-1 rounded">{c}</span>)}
                        </div>
                    </div>
                </StepCard>
            )}

            {analysis.personalConnection && (
                 <StepCard icon={<UsersIcon />} title="Personal Connection" step={3}>
                    <p>{analysis.personalConnection}</p>
                </StepCard>
            )}

           {analysis.morphology && (
             <StepCard icon={<AtomIcon />} title="Morphology & Etymology" step={4}>
                <div>
                    <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Meaning DNA:</h4>
                    <MorphologyDisplay morphology={analysis.morphology} />
                </div>
                {analysis.etymology && (
                    <div>
                        <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-2 mt-4">Word Story:</h4>
                        <p>{analysis.etymology}</p>
                    </div>
                )}
                {analysis.spellingConnection && <div>
                    <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-2 mt-4">Spelling Hint:</h4>
                    <p>{analysis.spellingConnection}</p>
                </div>}
            </StepCard>
           )}

           {analysis.semanticChunking && (
             <StepCard icon={<LinkIcon />} title="Semantic Chunking" step={5}>
                <div className="flex items-center gap-2 mb-4">
                    <h4 className="font-semibold text-slate-700 dark:text-slate-200">Theme:</h4>
                    <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-sm font-semibold px-3 py-1 rounded-full">{analysis.semanticTheme}</span>
                </div>
                <ul className="space-y-3">
                {analysis.semanticChunking.map((related: RelatedWord) => (
                    <li key={related.word} className="border-l-4 border-blue-200 dark:border-blue-800 pl-4">
                        <strong className="font-semibold text-slate-900 dark:text-white">{related.word}:</strong> {related.definition}
                    </li>
                ))}
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <div>
                        <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-2 flex items-center"><SwapIcon className="w-5 h-5 mr-2 text-green-500"/>Synonyms:</h4>
                        <div className="flex flex-wrap gap-2">{analysis.synonyms?.map(s => <span key={s} className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 text-sm font-medium px-2 py-1 rounded">{s}</span>)}</div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-2 flex items-center"><SwapIcon className="w-5 h-5 mr-2 text-red-500"/>Antonyms:</h4>
                        <div className="flex flex-wrap gap-2">{analysis.antonyms?.map(a => <span key={a} className="bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 text-sm font-medium px-2 py-1 rounded">{a}</span>)}</div>
                    </div>
                </div>
            </StepCard>
           )}
        </>
      )}
    </div>
  );
};

export default LearningSteps;
