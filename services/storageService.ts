
import { LearnedWord, VocabularyBank } from '../types';

const WORDS_STORAGE_KEY = 'deepWordLearnerWords';
const BANKS_STORAGE_KEY = 'deepWordLearnerBanks';

export const getLearnedWords = (): LearnedWord[] => {
  try {
    const wordsJson = localStorage.getItem(WORDS_STORAGE_KEY);
    return wordsJson ? JSON.parse(wordsJson) : [];
  } catch (error) {
    console.error("Error reading words from localStorage", error);
    return [];
  }
};

export const saveLearnedWords = (words: LearnedWord[]): void => {
  try {
    localStorage.setItem(WORDS_STORAGE_KEY, JSON.stringify(words));
  } catch (error) {
    console.error("Error writing words to localStorage", error);
  }
};

export const getVocabularyBanks = (): VocabularyBank[] => {
  try {
    const banksJson = localStorage.getItem(BANKS_STORAGE_KEY);
    return banksJson ? JSON.parse(banksJson) : [];
  } catch (error) {
    console.error("Error reading banks from localStorage", error);
    return [];
  }
};

export const saveVocabularyBanks = (banks: VocabularyBank[]): void => {
  try {
    localStorage.setItem(BANKS_STORAGE_KEY, JSON.stringify(banks));
  } catch (error) {
    console.error("Error writing banks to localStorage", error);
  }
};
