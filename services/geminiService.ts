
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { WordAnalysis } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY || API_KEY.startsWith('__')) {
  throw new Error("API_KEY environment variable is not set or has not been replaced. If deploying to Netlify, ensure your API_KEY is set in site settings and the netlify.toml file is configured to run the inject-env edge function.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fullResponseSchema = {
  type: Type.OBJECT,
  properties: {
    word: { type: Type.STRING },
    partOfSpeech: { type: Type.STRING },
    distilledDefinition: { type: Type.STRING, description: "A 'distilled' definition focusing on the critical aspects of the word's meaning." },
    contextExamples: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, enum: ['sentence', 'paragraph', 'quote'] },
          content: { type: Type.STRING },
          source: { type: Type.STRING, description: "Source of the quote, if applicable." }
        },
        required: ['type', 'content']
      }
    },
    collocates: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Words that naturally occur together with the target word." },
    personalConnection: { type: Type.STRING, description: "A question to prompt the user to form a personal connection." },
    morphology: {
      type: Type.OBJECT,
      properties: {
        prefix: { type: Type.OBJECT, properties: { part: { type: Type.STRING }, meaning: { type: Type.STRING } } },
        root: { type: Type.OBJECT, properties: { part: { type: Type.STRING }, meaning: { type: Type.STRING } }, required: ['part', 'meaning'] },
        suffix: { type: Type.OBJECT, properties: { part: { type: Type.STRING }, meaning: { type: Type.STRING } } }
      }
    },
    etymology: { type: Type.STRING, description: "The etymological narrative or 'story' behind the word." },
    spellingConnection: { type: Type.STRING, description: "Visual clues in spelling that link the word to its relatives." },
    semanticChunking: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: { word: { type: Type.STRING }, definition: { type: Type.STRING } },
        required: ['word', 'definition']
      }
    },
    semanticTheme: { type: Type.STRING, description: "A meaning-based group or theme for the word (e.g., 'Words for Lying')." },
    synonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
    antonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ["word", "partOfSpeech", "distilledDefinition", "contextExamples", "collocates", "personalConnection", "morphology", "etymology", "semanticChunking", "semanticTheme", "synonyms", "antonyms"]
};

const initialResponseSchema = {
    type: Type.OBJECT,
    properties: {
        word: { type: Type.STRING },
        partOfSpeech: { type: Type.STRING },
        distilledDefinition: { type: Type.STRING },
    },
    required: ["word", "partOfSpeech", "distilledDefinition"],
};

export const fetchInitialDefinition = async (word: string): Promise<Pick<WordAnalysis, 'word' | 'partOfSpeech' | 'distilledDefinition'>> => {
    const prompt = `For the word "${word}", quickly provide a JSON object with its 'word', 'partOfSpeech', and a 'distilledDefinition'.`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: initialResponseSchema,
                temperature: 0.2,
            }
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error fetching initial definition:", error);
        throw new Error("Failed to get initial definition from the AI.");
    }
}


export const fetchFullWordAnalysis = async (word: string): Promise<WordAnalysis> => {
  const prompt = `You are an expert linguist and English teacher specializing in deep vocabulary acquisition. For the word "${word}", provide a comprehensive analysis based on the 5-step framework.

1.  **Precise Definition:**
    *   \`distilledDefinition\`: Provide a 'distilled' definition focusing on the most critical aspects of the word's meaning.

2.  **Contextual Habitat:**
    *   \`contextExamples\`: Generate an array of three examples: a simple and clear 'sentence', a short 'paragraph', and a 'quote' from literature or a known figure (include the source).
    *   \`collocates\`: List 3-4 common collocates (words that frequently appear with this word).

3.  **Personal Connection:**
    *   \`personalConnection\`: Generate a single, thought-provoking question to help the user connect the word to their life or experiences.

4.  **Morphology & Etymology:**
    *   \`morphology\`: Break the word into its morphemes: provide its primary 'root', and if they exist, its 'prefix' and 'suffix', along with their meanings.
    *   \`etymology\`: Provide the etymological 'story' behind the word. Make it a memorable narrative.
    *   \`spellingConnection\` (optional): If there's a visual clue in the spelling that links it to related words (e.g., 'malign' and 'malignant'), describe it.

5.  **Semantic Chunking:**
    *   \`semanticChunking\`: List 3-4 thematically related words with their definitions.
    *   \`semanticTheme\`: Create a short, descriptive theme for this group of words (e.g., 'Words for harshness', 'Words related to secrecy').
    *   \`synonyms\`: Provide a list of 3-5 strong synonyms.
    *   \`antonyms\`: Provide a list of 2-4 strong antonyms.

Please provide the output in the specified JSON format.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: fullResponseSchema,
        temperature: 0.6,
      }
    });
    
    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText);
    
    if (typeof parsedData.word !== 'string' || !Array.isArray(parsedData.semanticChunking)) {
        throw new Error("Invalid data structure received from AI.");
    }

    return parsedData as WordAnalysis;

  } catch (error) {
    console.error("Error fetching or parsing word analysis:", error);
    throw new Error("Failed to get a valid analysis from the AI.");
  }
};

export const fetchDistractorDefinitions = async (word: string, correctDefinition: string): Promise<string[]> => {
    const prompt = `For a multiple-choice quiz about the word "${word}", the correct definition is: "${correctDefinition}".
    
    Please generate three plausible but incorrect definitions for "${word}". These distractors should be similar in tone and structure to the correct one.
    
    Return a JSON object with a single key "distractors" which is an array of three strings.`;

    const distractorsSchema = {
        type: Type.OBJECT,
        properties: {
            distractors: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
            }
        },
        required: ["distractors"]
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: distractorsSchema,
                temperature: 0.8,
            }
        });

        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText);
        return parsed.distractors;
    } catch (error) {
        console.error("Error fetching distractor definitions:", error);
        throw new Error("Failed to get valid distractors from the AI.");
    }
}

export const fetchAudioPronunciation = async (word: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: `Pronounce: ${word}` }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });

        const audioPart = response.candidates?.[0]?.content?.parts.find(
          (part) => !!part.inlineData?.data
        );

        const base64Audio = audioPart?.inlineData?.data;
        
        if (!base64Audio) {
            throw new Error("No audio data received from API.");
        }
        return base64Audio;
    } catch (error) {
        console.error("Error fetching audio pronunciation:", error);
        throw new Error("Failed to get audio pronunciation.");
    }
};
