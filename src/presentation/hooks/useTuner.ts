/**
 * Main tuner hook - orchestrates all tuner functionality.
 * Combines audio capture, FFT pitch detection, and tuning calculation.
 */

import { useMemo } from 'react';
import { useAudioCapture } from './useAudioCapture';
import { useFFTPitchDetection } from './useFFTPitchDetection';
import { frequencyToNote } from '../../domain/note-converter';
import { calculateTuningState } from '../../domain/tuning-calculator';
import type { Tuning } from '../../domain/tunings';
import type { Note, TuningState } from '../../domain/types';

import type { AudioCaptureService } from '../../infrastructure/audio-capture';

interface UseTunerResult {
    isActive: boolean;
    error: Error | null;
    start: () => Promise<void>;
    stop: () => void;
    frequency: number | null;
    note: Note | null;
    tuningState: TuningState | null;
    audioService: AudioCaptureService | null;
}

export function useTuner(tuning: Tuning): UseTunerResult {
    const { isActive, error, start, stop, audioService } = useAudioCapture();
    const frequency = useFFTPitchDetection({ audioService, isActive });

    // Convert detected frequency to note
    const note = useMemo(() => {
        if (!frequency) return null;
        return frequencyToNote(frequency);
    }, [frequency]);

    // Calculate tuning state based on nearest string in the tuning
    const tuningState = useMemo(() => {
        if (!frequency || !note) return null;

        // Find the closest string frequency in the tuning
        let closestString = tuning.strings[0];
        let minDiff = Math.abs(frequency - closestString.frequency);

        for (const string of tuning.strings) {
            const diff = Math.abs(frequency - string.frequency);
            if (diff < minDiff) {
                minDiff = diff;
                closestString = string;
            }
        }

        return calculateTuningState(frequency, closestString.frequency);
    }, [frequency, note, tuning]);

    return {
        isActive,
        error,
        start,
        stop,
        frequency,
        note,
        tuningState,
        audioService,
    };
}