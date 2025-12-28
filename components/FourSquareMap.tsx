
import React, { useState } from 'react';
import { LearnedWord } from '../types';

interface FourSquareMapProps {
    word: LearnedWord;
    onSaveNote: (note: string) => void;
}

interface SquareProps {
    title: string;
    children: React.ReactNode;
}

const Square: React.FC<SquareProps> = ({ title, children }) => (
    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 min-h-[180px]">
        <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-2">{title}</h4>
        <div className="text-slate-600 dark:text-slate-300 space-y-2">{children}</div>
    </div>
);

const FourSquareMap: React.FC<FourSquareMapProps> = ({ word, onSaveNote }) => {
    const [note, setNote] = useState(word.personalConnectionNote || '');

    const handleSave = () => {
        onSaveNote(note);
    };

    const quote = word.contextExamples.find(ex => ex.type === 'quote');

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Square title="Definition & Details">
                <p className="font-semibold">{word.distilledDefinition}</p>
                <p className="text-sm italic">{word.partOfSpeech}</p>
            </Square>
            <Square title="Context & Usage">
                {quote && <p className="italic">"{quote.content}" <span className="text-sm not-italic">— {quote.source}</span></p>}
                <div>
                    <h5 className="font-semibold text-sm">Collocates:</h5>
                    <p className="text-sm">{word.collocates.join(', ')}</p>
                </div>
            </Square>
            <Square title="Personal Connection">
                <p className="text-sm italic">{word.personalConnection}</p>
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Your thoughts, images, mnemonics..."
                    className="w-full mt-2 p-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    rows={3}
                ></textarea>
                <button 
                    onClick={handleSave}
                    className="mt-2 px-3 py-1 text-sm bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Save Note
                </button>
            </Square>
            <Square title="Relationships">
                 <div>
                    <h5 className="font-semibold text-sm">Synonyms:</h5>
                    <p className="text-sm">{word.synonyms.join(', ')}</p>
                </div>
                 <div>
                    <h5 className="font-semibold text-sm">Antonyms:</h5>
                    <p className="text-sm">{word.antonyms.join(', ')}</p>
                </div>
            </Square>
        </div>
    );
};

export default FourSquareMap;
