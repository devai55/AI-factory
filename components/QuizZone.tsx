
import React from 'react';
import { LearnedWord } from '../types';
import DefinitionQuiz from './DefinitionQuiz';

interface QuizZoneProps {
  learnedWords: LearnedWord[];
}

const QuizZone: React.FC<QuizZoneProps> = ({ learnedWords }) => {
  return (
    <div className="space-y-6">
      <DefinitionQuiz learnedWords={learnedWords} />
    </div>
  );
};

export default QuizZone;
