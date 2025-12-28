
import React, { useState } from 'react';
import { LearnedWord, KnowledgeLevel, VocabularyBank } from '../types';
import KnowledgeLevelSelector from './KnowledgeLevelSelector';
import FourSquareMap from './FourSquareMap';
import ChevronDownIcon from './icons/ChevronDownIcon';
import AddToBankMenu from './AddToBankMenu';
import AudioPlayer from './AudioPlayer';
import ProgressChart from './ProgressChart';

interface DashboardProps {
  learnedWords: LearnedWord[];
  onUpdateKnowledgeLevel: (word: string, level: KnowledgeLevel) => void;
  onUpdatePersonalNote: (word: string, note: string) => void;
  vocabularyBanks: VocabularyBank[];
  onCreateBank: (bankName: string) => void;
  onAddWordToBank: (word: string, bankName: string) => void;
  onUpdateWordWithAudio: (word: string, audioSrc: string) => void;
}

const EXPOSURE_GOAL = 12;

const WordCard: React.FC<{
  word: LearnedWord,
  onUpdateKnowledgeLevel: (word: string, level: KnowledgeLevel) => void,
  onUpdatePersonalNote: (word: string, note: string) => void,
  vocabularyBanks: VocabularyBank[],
  onCreateBank: (bankName: string) => void;
  onAddWordToBank: (word: string, bankName: string) => void;
  onUpdateWordWithAudio: (word: string, audioSrc: string) => void;
}> = ({ word, onUpdateKnowledgeLevel, onUpdatePersonalNote, vocabularyBanks, onCreateBank, onAddWordToBank, onUpdateWordWithAudio }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const progress = Math.min((word.exposureCount / EXPOSURE_GOAL) * 100, 100);

  return (
    <div className="bg-white dark:bg-slate-800/50 p-5 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 transition-all">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-2xl font-bold capitalize text-slate-900 dark:text-white">{word.word}</h3>
              <AudioPlayer 
                word={word.word} 
                cachedSrc={word.audioSrc}
                onAudioFetch={(src) => onUpdateWordWithAudio(word.word, src)}
              />
              <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold px-2.5 py-1 rounded-full hidden sm:block">{word.semanticTheme}</span>
            </div>
             <AddToBankMenu 
              word={word.word}
              banks={vocabularyBanks}
              onCreateBank={onCreateBank}
              onAddWordToBank={onAddWordToBank}
             />
          </div>
          <div className="mt-4">
              <div className="flex justify-between items-center mb-1 text-sm text-slate-600 dark:text-slate-400">
                <span>Exposure Progress</span>
                <span>{word.exposureCount} / {EXPOSURE_GOAL}</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0 self-end sm:self-center">
          <KnowledgeLevelSelector
            level={word.knowledgeLevel}
            onChange={(level) => onUpdateKnowledgeLevel(word.word, level)}
          />
          <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-expanded={isExpanded}
            aria-label={`Show details for ${word.word}`}
          >
            <ChevronDownIcon className={`w-6 h-6 text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-6 animate-fade-in">
          <FourSquareMap 
            word={word} 
            onSaveNote={(note) => onUpdatePersonalNote(word.word, note)}
          />
        </div>
      )}
    </div>
  );
};


const Dashboard: React.FC<DashboardProps> = ({ learnedWords, ...rest }) => {
  if (learnedWords.length === 0) {
    return (
      <div className="text-center p-10 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
        <h3 className="text-xl font-medium text-slate-700 dark:text-slate-300">Your collection is empty.</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Learned words will appear here for you to track your progress.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ProgressChart learnedWords={learnedWords} />
      {learnedWords.map((word) => (
        <WordCard 
            key={word.word} 
            word={word}
            {...rest}
        />
      ))}
    </div>
  );
};

export default Dashboard;
