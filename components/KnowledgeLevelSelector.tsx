
import React from 'react';
import { KnowledgeLevel, KNOWLEDGE_LEVEL_DESCRIPTIONS } from '../types';

interface KnowledgeLevelSelectorProps {
  level: KnowledgeLevel;
  onChange: (level: KnowledgeLevel) => void;
}

const levels: KnowledgeLevel[] = [1, 2, 3, 4];

const KnowledgeLevelSelector: React.FC<KnowledgeLevelSelectorProps> = ({ level, onChange }) => {
  return (
    <div className="flex items-center space-x-2" role="radiogroup" aria-label="Knowledge Level">
      {levels.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => onChange(l)}
          className={`w-8 h-8 rounded-full border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900
            ${
              l <= level
                ? 'bg-blue-500 border-blue-600 dark:bg-blue-500 dark:border-blue-400'
                : 'bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 hover:bg-slate-300 dark:hover:bg-slate-600'
            }
          `}
          title={KNOWLEDGE_LEVEL_DESCRIPTIONS[l]}
          aria-label={`Set knowledge level to ${l}: ${KNOWLEDGE_LEVEL_DESCRIPTIONS[l]}`}
          aria-checked={l === level}
          role="radio"
        ></button>
      ))}
    </div>
  );
};

export default KnowledgeLevelSelector;
