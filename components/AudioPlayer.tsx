
import React, { useState, useCallback } from 'react';
import { fetchAudioPronunciation } from '../services/geminiService';
import { playAudio } from '../utils/audioUtils';
import SpeakerIcon from './icons/SpeakerIcon';
import SpinnerIcon from './icons/SpinnerIcon';

interface AudioPlayerProps {
    word: string;
    cachedSrc?: string;
    onAudioFetch?: (src: string) => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ word, cachedSrc, onAudioFetch }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [audioSrc, setAudioSrc] = useState<string | null>(cachedSrc || null);

    const handlePlayAudio = useCallback(async () => {
        if (isLoading) return;
        
        if (audioSrc) {
            playAudio(audioSrc);
            return;
        }

        setIsLoading(true);
        try {
            const newAudioSrc = await fetchAudioPronunciation(word);
            setAudioSrc(newAudioSrc);
            if (onAudioFetch) {
                onAudioFetch(newAudioSrc);
            }
            playAudio(newAudioSrc);
        } catch (error) {
            console.error("Error in audio player:", error);
        } finally {
            setIsLoading(false);
        }
    }, [audioSrc, word, isLoading, onAudioFetch]);

    return (
        <button 
            onClick={handlePlayAudio}
            disabled={isLoading}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-wait"
            aria-label={`Pronounce ${word}`}
        >
            {isLoading 
                ? <SpinnerIcon className="w-6 h-6 text-slate-500" /> 
                : <SpeakerIcon className="w-6 h-6 text-slate-500" />
            }
        </button>
    );
};

export default AudioPlayer;
