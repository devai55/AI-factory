
import { LearnedWord } from '../types';

export interface ChartData {
  labels: string[];
  values: number[];
  maxValue: number;
}

export const processLearningDataForChart = (words: LearnedWord[]): ChartData => {
  const data: { [key: string]: number } = {};
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const labels: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });
    labels.push(dayLabel);
    const dateString = date.toISOString().split('T')[0];
    data[dateString] = 0;
  }
  
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6);

  words.forEach(word => {
    const learnedDate = new Date(word.lastLearned);
    learnedDate.setHours(0, 0, 0, 0);
    
    if (learnedDate >= sevenDaysAgo && learnedDate <= today) {
        const dateString = learnedDate.toISOString().split('T')[0];
        if (data[dateString] !== undefined) {
            data[dateString]++;
        }
    }
  });

  const values = Object.values(data);
  const maxValue = Math.max(...values, 1); // Avoid division by zero, min height of 1

  return { labels, values, maxValue };
};

export const calculateAverageKnowledge = (words: LearnedWord[]): number => {
    if (words.length === 0) return 0;
    const total = words.reduce((sum, word) => sum + word.knowledgeLevel, 0);
    return parseFloat((total / words.length).toFixed(1));
}
