
import React, { useState, useRef, useEffect } from 'react';
import { VocabularyBank } from '../types';
import PlusIcon from './icons/PlusIcon';

interface AddToBankMenuProps {
    word: string;
    banks: VocabularyBank[];
    onCreateBank: (bankName: string) => void;
    onAddWordToBank: (word: string, bankName: string) => void;
}

const AddToBankMenu: React.FC<AddToBankMenuProps> = ({ word, banks, onCreateBank, onAddWordToBank }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showNewBankInput, setShowNewBankInput] = useState(false);
    const [newBankName, setNewBankName] = useState('');
    const menuRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setShowNewBankInput(false);
                setNewBankName('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCreateBank = () => {
        onCreateBank(newBankName);
        onAddWordToBank(word, newBankName);
        setNewBankName('');
        setShowNewBankInput(false);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={menuRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Add to bank"
            >
                <PlusIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg z-20 border border-slate-200 dark:border-slate-700">
                    <div className="py-1">
                        {banks.map(bank => (
                            <button 
                                key={bank.name}
                                onClick={() => { onAddWordToBank(word, bank.name); setIsOpen(false); }}
                                className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50"
                                disabled={bank.words.includes(word)}
                            >
                                {bank.name}
                            </button>
                        ))}
                        <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>
                        {showNewBankInput ? (
                             <div className="p-2">
                                <input
                                    type="text"
                                    value={newBankName}
                                    onChange={(e) => setNewBankName(e.target.value)}
                                    placeholder="New bank name..."
                                    className="w-full px-2 py-1 text-sm bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md"
                                    autoFocus
                                    onKeyDown={(e) => e.key === 'Enter' && handleCreateBank()}
                                />
                                <button onClick={handleCreateBank} className="w-full text-center mt-2 px-2 py-1 text-sm bg-blue-600 text-white rounded-md">Create & Add</button>
                             </div>
                        ) : (
                             <button
                                onClick={() => setShowNewBankInput(true)}
                                className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center"
                            >
                                <PlusIcon className="w-4 h-4 mr-2" /> New Bank
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddToBankMenu;
