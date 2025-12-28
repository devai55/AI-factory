
import React from 'react';

interface WordInputProps {
  onSubmit: (word: string) => void;
  isLoading: boolean;
  word: string;
  setWord: (word: string) => void;
}

const WordInput: React.FC<WordInputProps> = ({ onSubmit, isLoading, word, setWord }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(word);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="text"
        value={word}
        onChange={(e) => setWord(e.target.value)}
        placeholder="Enter a word (e.g., procrustean)"
        className="flex-grow w-full px-4 py-3 text-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
        disabled={isLoading}
      />
      <button
        type="submit"
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-colors disabled:bg-slate-400 disabled:dark:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Learning...
          </>
        ) : (
          'Learn Word'
        )}
      </button>
    </form>
  );
};

export default WordInput;
