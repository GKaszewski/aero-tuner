/**
 * Hook for managing audio capture lifecycle.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { AudioCaptureService } from '../../infrastructure/audio-capture';
import type { AudioDataCallback } from '../../infrastructure/audio-capture';

interface UseAudioCaptureResult {
    isActive: boolean;
    error: Error | null;
    start: () => Promise<void>;
    stop: () => void;
    onAudioData: (callback: AudioDataCallback) => void;
    sampleRate: number;
    audioService: AudioCaptureService | null;
}

export function useAudioCapture(): UseAudioCaptureResult {
    const serviceRef = useRef<AudioCaptureService | null>(null);
    const [isActive, setIsActive] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [sampleRate, setSampleRate] = useState(44100);

    // Initialize service
    useEffect(() => {
        serviceRef.current = new AudioCaptureService();

        return () => {
            if (serviceRef.current) {
                serviceRef.current.stop();
                serviceRef.current = null;
            }
        };
    }, []);

    const start = async () => {
        if (!serviceRef.current) return;

        try {
            setError(null);
            await serviceRef.current.start();
            setIsActive(true);
            setSampleRate(serviceRef.current.getSampleRate());
        } catch (err) {
            setError(err as Error);
            setIsActive(false);
        }
    };

    const stop = () => {
        if (serviceRef.current) {
            serviceRef.current.stop();
            setIsActive(false);
        }
    };

    const onAudioData = useCallback((callback: AudioDataCallback) => {
        if (serviceRef.current) {
            serviceRef.current.onAudioData(callback);
        }
    }, []);

    return {
        isActive,
        error,
        start,
        stop,
        onAudioData,
        sampleRate,
        audioService: serviceRef.current,
    };
}
