
import React, { useState } from 'react';
import { VocabularyBank } from '../types';
import ChevronDownIcon from './icons/ChevronDownIcon';
import TrashIcon from './icons/TrashIcon';
import PlusIcon from './icons/PlusIcon';

interface VocabularyBanksProps {
  banks: VocabularyBank[];
  onCreateBank: (bankName: string) => void;
  onDeleteBank: (bankName: string) => void;
  onRemoveWordFromBank: (word: string, bankName: string) => void;
}

const BankItem: React.FC<{
    bank: VocabularyBank;
    onDeleteBank: (bankName: string) => void;
    onRemoveWordFromBank: (word: string, bankName: string) => void;
}> = ({ bank, onDeleteBank, onRemoveWordFromBank }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-white dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        disabled={bank.words.length === 0}
                        className="flex items-center gap-3 disabled:cursor-not-allowed"
                    >
                        <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">{bank.name}</h4>
                        <span className="text-sm bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full">{bank.words.length}</span>
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    {bank.words.length > 0 && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            aria-label="Expand bank"
                            className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
                        >
                            <ChevronDownIcon className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                    )}
                    <button onClick={() => onDeleteBank(bank.name)} aria-label="Delete bank" className="p-1 text-slate-500 hover:text-red-500 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
            {isExpanded && bank.words.length > 0 && (
                 <ul className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2 animate-fade-in">
                    {bank.words.map(word => (
                        <li key={word} className="flex justify-between items-center group">
                            <span className="capitalize">{word}</span>
                            <button onClick={() => onRemoveWordFromBank(word, bank.name)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <TrashIcon className="w-4 h-4 text-slate-400 hover:text-red-500"/>
                            </button>
                        </li>
                    ))}
                 </ul>
            )}
        </div>
    );
};

const CreateBankForm: React.FC<{ onCreateBank: (name: string) => void }> = ({ onCreateBank }) => {
    const [name, setName] = useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onCreateBank(name.trim());
            setName('');
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 p-2 bg-slate-100 dark:bg-slate-900/50 rounded-lg">
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="New bank name..."
                className="flex-grow w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Create</button>
        </form>
    );
}

const VocabularyBanks: React.FC<VocabularyBanksProps> = ({ banks, onCreateBank, ...rest }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  if (banks.length === 0 && !showCreateForm) {
    return (
      <div className="text-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg h-full flex flex-col justify-center items-center">
        <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300">No Vocabulary Banks</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Organize your words into custom lists.</p>
        <button
            onClick={() => setShowCreateForm(true)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
            <PlusIcon className="w-5 h-5" />
            Create Your First Bank
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {banks.map(bank => (
        <BankItem key={bank.name} bank={bank} {...rest} />
      ))}
       <div className="mt-4">
        {showCreateForm ? (
            <CreateBankForm onCreateBank={(name) => {
                onCreateBank(name);
                setShowCreateForm(false);
            }} />
        ) : (
             <button
                onClick={() => setShowCreateForm(true)}
                className="w-full mt-2 px-4 py-2 text-sm bg-slate-200 dark:bg-slate-800/80 hover:bg-slate-300 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300 font-semibold rounded-md flex items-center justify-center gap-2"
            >
                <PlusIcon className="w-5 h-5" />
                Create New Bank
            </button>
        )}
       </div>
    </div>
  );
};

export default VocabularyBanks;
