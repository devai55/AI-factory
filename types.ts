
export interface RelatedWord {
  word: string;
  definition: string;
}

export interface ContextExample {
  type: 'sentence' | 'paragraph' | 'quote';
  content: string;
  source?: string;
}

export interface Morphology {
  prefix?: { part: string; meaning: string };
  root: { part: string; meaning: string };
  suffix?: { part: string; meaning: string };
}

export interface WordAnalysis {
  word: string;
  partOfSpeech: string;
  distilledDefinition: string; // Step 1
  contextExamples?: ContextExample[]; // Step 2
  collocates?: string[]; // Step 2
  personalConnection?: string; // Step 3
  morphology?: Morphology; // Step 4
  etymology?: string; // Step 4
  spellingConnection?: string; // Step 4
  semanticChunking?: RelatedWord[]; // Step 5
  semanticTheme?: string; // Step 5
  synonyms?: string[]; // Step 5
  antonyms?: string[]; // Step 5
}

export type KnowledgeLevel = 1 | 2 | 3 | 4;

export const KNOWLEDGE_LEVEL_DESCRIPTIONS: { [key in KnowledgeLevel]: string } = {
  1: 'Heard of it, unsure of meaning.',
  2: 'Recognize it, can give a general definition.',
  3: 'Understand it well, can use it in a sentence.',
  4: 'Comfortable using it expressively and accurately.',
};


export interface LearnedWord extends WordAnalysis {
    knowledgeLevel: KnowledgeLevel;
    exposureCount: number;
    lastLearned: string; // ISO date string
    personalConnectionNote?: string; // User-added note
    audioSrc?: string; // Cached base64 audio source
}

export interface VocabularyBank {
  name: string;
  words: string[]; // Storing word strings
}
