/**
 * Hook for pitch detection from audio data.
 */

import { useEffect, useRef, useState } from 'react';
import { PitchDetector } from '../../infrastructure/pitch-detector';

interface UsePitchDetectionProps {
    isActive: boolean;
    onAudioData: (callback: (data: Float32Array) => void) => void;
    sampleRate: number;
}

interface UsePitchDetectionResult {
    frequency: number | null;
}

export function usePitchDetection({
    isActive,
    onAudioData,
    sampleRate,
}: UsePitchDetectionProps): UsePitchDetectionResult {
    const detectorRef = useRef<PitchDetector | null>(null);
    const [frequency, setFrequency] = useState<number | null>(null);

    // Initialize pitch detector with correct sample rate
    useEffect(() => {
        detectorRef.current = new PitchDetector(sampleRate);
    }, [sampleRate]);

    // Set up audio data processing
    useEffect(() => {
        if (!isActive) {
            setFrequency(null);
            return;
        }

        const handleAudioData = (data: Float32Array) => {
            if (detectorRef.current) {
                const detectedFrequency = detectorRef.current.detectPitch(data);
                setFrequency(detectedFrequency);
            }
        };

        onAudioData(handleAudioData);
    }, [isActive, onAudioData]);

    return { frequency };
}
