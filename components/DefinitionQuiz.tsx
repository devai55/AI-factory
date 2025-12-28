
import React, { useState, useCallback, useEffect } from 'react';
import { LearnedWord } from '../types';
import { fetchDistractorDefinitions } from '../services/geminiService';
import RefreshIcon from './icons/RefreshIcon';
import SpinnerIcon from './icons/SpinnerIcon';

interface DefinitionQuizProps {
  learnedWords: LearnedWord[];
}

interface Question {
    word: LearnedWord;
    options: string[];
    correctAnswer: string;
}

const shuffleArray = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

const DefinitionQuiz: React.FC<DefinitionQuizProps> = ({ learnedWords }) => {
    const [question, setQuestion] = useState<Question | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [score, setScore] = useState({ correct: 0, total: 0 });

    const generateQuestion = useCallback(async () => {
        if (learnedWords.length === 0) return;

        setIsLoading(true);
        setError(null);
        setQuestion(null);
        setSelectedAnswer(null);
        setIsCorrect(null);

        try {
            const randomWord = learnedWords[Math.floor(Math.random() * learnedWords.length)];
            const correctDefinition = randomWord.distilledDefinition;

            const distractors = await fetchDistractorDefinitions(randomWord.word, correctDefinition);
            
            const options = shuffleArray([correctDefinition, ...distractors]);

            setQuestion({
                word: randomWord,
                options,
                correctAnswer: correctDefinition
            });
        } catch (e) {
            setError("Failed to generate a quiz question. Please try again.");
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [learnedWords]);
    
    useEffect(() => {
        if (learnedWords.length > 0) {
            generateQuestion();
        }
    }, [learnedWords, generateQuestion]);

    const handleAnswer = (answer: string) => {
        if (selectedAnswer) return; // Prevent changing answer

        setSelectedAnswer(answer);
        const correct = answer === question?.correctAnswer;
        setIsCorrect(correct);
        setScore(prev => ({
            correct: prev.correct + (correct ? 1 : 0),
            total: prev.total + 1,
        }));
    };
    
    const getButtonClass = (option: string) => {
        if (!selectedAnswer) {
            return "bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700";
        }
        if (option === question?.correctAnswer) {
            return "bg-green-100 dark:bg-green-900/50 border-green-500 text-green-800 dark:text-green-200 ring-2 ring-green-500";
        }
        if (option === selectedAnswer) {
            return "bg-red-100 dark:bg-red-900/50 border-red-500 text-red-800 dark:text-red-200";
        }
        return "bg-white dark:bg-slate-800 opacity-60";
    };

    if (learnedWords.length === 0) {
        return (
             <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 text-center h-full flex flex-col justify-center">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Definition Quiz</h3>
                <p className="text-slate-500 dark:text-slate-400">Learn a word to start the quiz!</p>
            </div>
        );
    }
    
    return (
        <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Definition Quiz</h3>
                <div className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                    Score: {score.correct} / {score.total}
                </div>
            </div>

            {isLoading && <div className="text-center p-8"><SpinnerIcon className="w-8 h-8 mx-auto" /></div>}
            {error && <div className="text-center p-4 text-red-500">{error}</div>}

            {question && !isLoading && (
                <div>
                    <p className="text-center mb-4 text-slate-600 dark:text-slate-300">What is the definition of...</p>
                    <h4 className="text-3xl font-bold text-center mb-6 capitalize text-blue-600 dark:text-blue-400">{question.word.word}</h4>
                    <div className="space-y-3">
                        {question.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswer(option)}
                                disabled={!!selectedAnswer}
                                className={`w-full text-left p-4 rounded-lg border border-slate-300 dark:border-slate-600 transition-all text-slate-700 dark:text-slate-200 disabled:cursor-not-allowed ${getButtonClass(option)}`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            
            {(selectedAnswer || error) && (
                <button 
                    onClick={generateQuestion}
                    disabled={isLoading}
                    className="w-full mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-colors disabled:bg-slate-400 disabled:dark:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isLoading ? 'Loading...' : 'Next Question'}
                    {!isLoading && <RefreshIcon className="w-5 h-5 ml-2" />}
                </button>
            )}
        </div>
    );
};

export default DefinitionQuiz;
