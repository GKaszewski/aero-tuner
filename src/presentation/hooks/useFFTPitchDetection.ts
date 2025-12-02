/**
 * Hook for FFT-based pitch detection.
 */

import { useEffect, useRef, useState } from 'react';
import { FFTPitchDetector } from '../../infrastructure/fft-pitch-detector';
import type { AudioCaptureService } from '../../infrastructure/audio-capture';

interface UseFFTPitchDetectionProps {
    audioService: AudioCaptureService | null;
    isActive: boolean;
}

export function useFFTPitchDetection({ audioService, isActive }: UseFFTPitchDetectionProps): number | null {
    const detectorRef = useRef<FFTPitchDetector | null>(null);
    const [frequency, setFrequency] = useState<number | null>(null);
    const rafIdRef = useRef<number | null>(null);

    useEffect(() => {
        // Clear frequency when inactive
        if (!isActive || !audioService) {
            setFrequency(null);
            detectorRef.current = null; // Clear detector when inactive
            return;
        }

        const analyser = audioService.getAnalyser();
        const sampleRate = audioService.getSampleRate();

        if (!analyser) {
            setFrequency(null);
            return;
        }

        // Always create a fresh FFT pitch detector with the current analyser
        // This is important because the analyser node can change when audio restarts
        detectorRef.current = new FFTPitchDetector(analyser, sampleRate);

        // Start detection loop
        const detect = () => {
            if (detectorRef.current && audioService.isActive()) {
                const detectedFrequency = detectorRef.current.detectPitch();
                setFrequency(detectedFrequency);
            }
            rafIdRef.current = requestAnimationFrame(detect);
        };

        detect();

        // Cleanup
        return () => {
            if (rafIdRef.current !== null) {
                cancelAnimationFrame(rafIdRef.current);
                rafIdRef.current = null;
            }
        };
    }, [audioService, isActive]);

    return frequency;
}
