
import React, { useState, useCallback } from 'react';
import { WordAnalysis, LearnedWord, KnowledgeLevel, VocabularyBank } from './types';
import { fetchInitialDefinition, fetchFullWordAnalysis } from './services/geminiService';
import { getLearnedWords, saveLearnedWords, getVocabularyBanks, saveVocabularyBanks } from './services/storageService';
import WordInput from './components/WordInput';
import LearningSteps from './components/LearningSteps';
import LoadingSpinner from './components/LoadingSpinner';
import Dashboard from './components/Dashboard';
import QuizZone from './components/QuizZone';
import VocabularyBanks from './components/VocabularyBanks';
import AudioPlayer from './components/AudioPlayer';

type LoadingState = 'idle' | 'initial' | 'details';

const App: React.FC = () => {
  const [word, setWord] = useState<string>('');
  const [analysis, setAnalysis] = useState<WordAnalysis | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [learnedWords, setLearnedWords] = useState<LearnedWord[]>(getLearnedWords);
  const [vocabularyBanks, setVocabularyBanks] = useState<VocabularyBank[]>(getVocabularyBanks);

  const handleLearnWord = useCallback(async (wordToLearn: string) => {
    if (!wordToLearn.trim()) {
      setError('Please enter a word.');
      return;
    }
    setLoadingState('initial');
    setError(null);
    setAnalysis(null);
    const lowercasedWord = wordToLearn.toLowerCase();

    try {
      // Step 1: Fetch initial definition quickly
      const initialData = await fetchInitialDefinition(wordToLearn);
      setAnalysis(initialData);
      setLoadingState('details');

      // Step 2: Fetch the rest of the details
      const fullData = await fetchFullWordAnalysis(wordToLearn);
      setAnalysis(fullData);

      // Step 3: Save the complete data
      setLearnedWords(prevWords => {
        const existingWordIndex = prevWords.findIndex(w => w.word.toLowerCase() === lowercasedWord);
        let newWords = [...prevWords];

        if (existingWordIndex !== -1) {
          const updatedWord = {
            ...newWords[existingWordIndex],
            exposureCount: newWords[existingWordIndex].exposureCount + 1,
            lastLearned: new Date().toISOString(),
            ...fullData,
          };
          newWords[existingWordIndex] = updatedWord;
        } else {
          const newLearnedWord: LearnedWord = {
            ...fullData,
            knowledgeLevel: 1,
            exposureCount: 1,
            lastLearned: new Date().toISOString(),
          };
          newWords.push(newLearnedWord);
        }
        
        newWords.sort((a, b) => new Date(b.lastLearned).getTime() - new Date(a.lastLearned).getTime());
        saveLearnedWords(newWords);
        return newWords;
      });

    } catch (e) {
      console.error(e);
      setError('Failed to learn the word. The AI may be busy, or the word might be too obscure. Please try again.');
      setAnalysis(null); // Clear partial data on error
    } finally {
      setLoadingState('idle');
    }
  }, []);
  
  const handleUpdateKnowledgeLevel = useCallback((wordToUpdate: string, level: KnowledgeLevel) => {
    setLearnedWords(prevWords => {
      const newWords = prevWords.map(w =>
        w.word.toLowerCase() === wordToUpdate.toLowerCase()
          ? { ...w, knowledgeLevel: level }
          : w
      );
      saveLearnedWords(newWords);
      return newWords;
    });
  }, []);

  const handleUpdatePersonalNote = useCallback((wordToUpdate: string, note: string) => {
    setLearnedWords(prevWords => {
      const newWords = prevWords.map(w =>
        w.word.toLowerCase() === wordToUpdate.toLowerCase()
          ? { ...w, personalConnectionNote: note }
          : w
      );
      saveLearnedWords(newWords);
      return newWords;
    });
  }, []);
  
  const handleCreateBank = (bankName: string) => {
     if (bankName && !vocabularyBanks.some(b => b.name.toLowerCase() === bankName.toLowerCase())) {
        const newBank = { name: bankName, words: [] };
        const updatedBanks = [...vocabularyBanks, newBank];
        setVocabularyBanks(updatedBanks);
        saveVocabularyBanks(updatedBanks);
     }
  };

  const handleDeleteBank = (bankName: string) => {
    const updatedBanks = vocabularyBanks.filter(b => b.name !== bankName);
    setVocabularyBanks(updatedBanks);
    saveVocabularyBanks(updatedBanks);
  };

  const handleAddWordToBank = (word: string, bankName: string) => {
    const updatedBanks = vocabularyBanks.map(b => {
      if (b.name === bankName && !b.words.includes(word)) {
        return { ...b, words: [...b.words, word] };
      }
      return b;
    });
    setVocabularyBanks(updatedBanks);
    saveVocabularyBanks(updatedBanks);
  };
  
  const handleRemoveWordFromBank = (word: string, bankName: string) => {
      const updatedBanks = vocabularyBanks.map(b => {
        if (b.name === bankName) {
            return { ...b, words: b.words.filter(w => w !== word) };
        }
        return b;
      });
      setVocabularyBanks(updatedBanks);
      saveVocabularyBanks(updatedBanks);
  };

  const handleUpdateWordWithAudio = (word: string, audioSrc: string) => {
    setLearnedWords(prevWords => {
      const newWords = prevWords.map(w =>
        w.word.toLowerCase() === word.toLowerCase()
          ? { ...w, audioSrc: audioSrc }
          : w
      );
      saveLearnedWords(newWords);
      return newWords;
    });
  };

  const isLoading = loadingState !== 'idle';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight">Deep Word Learner</h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Master vocabulary with a 5-step learning framework.</p>
        </header>

        <main>
          <div className="sticky top-4 z-10 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <WordInput
              onSubmit={handleLearnWord}
              isLoading={isLoading}
              word={word}
              setWord={setWord}
            />
          </div>

          <div className="mt-10">
            {loadingState === 'initial' && <LoadingSpinner />}
            {error && <div className="text-center p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">{error}</div>}
            
            {loadingState === 'idle' && !analysis && !error && (
               <div className="text-center p-10 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
                 <h2 className="text-xl font-medium text-slate-700 dark:text-slate-300">Ready to learn?</h2>
                 <p className="text-slate-500 dark:text-slate-400 mt-2">Enter a word above to begin your deep learning journey.</p>
               </div>
            )}

            {analysis && (
              <div className="animate-fade-in">
                <div className="text-center mb-8 flex justify-center items-center gap-4">
                    <h2 className="text-4xl font-bold capitalize text-slate-900 dark:text-white">{analysis.word}</h2>
                    <AudioPlayer word={analysis.word} />
                </div>
                <LearningSteps analysis={analysis} isLoadingDetails={loadingState === 'details'} />
              </div>
            )}
          </div>
        </main>

        <section className="mt-20">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 text-center">Progress & Collection</h2>
          <Dashboard
            learnedWords={learnedWords}
            onUpdateKnowledgeLevel={handleUpdateKnowledgeLevel}
            onUpdatePersonalNote={handleUpdatePersonalNote}
            vocabularyBanks={vocabularyBanks}
            onCreateBank={handleCreateBank}
            onAddWordToBank={handleAddWordToBank}
            onUpdateWordWithAudio={handleUpdateWordWithAudio}
          />
        </section>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
            <section>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 text-center">Quiz Zone</h2>
                <QuizZone learnedWords={learnedWords} />
            </section>
            <section>
                 <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 text-center">Vocabulary Banks</h2>
                 <VocabularyBanks
                    banks={vocabularyBanks}
                    onCreateBank={handleCreateBank}
                    onDeleteBank={handleDeleteBank}
                    onRemoveWordFromBank={handleRemoveWordFromBank}
                 />
            </section>
        </div>
        
        <footer className="text-center mt-16 py-6 border-t border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">Powered by AI. Learn smarter, not harder.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
