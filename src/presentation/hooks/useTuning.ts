/**
 * Hook for managing selected tuning state.
 * Persists selection to localStorage.
 */

import { useState, useEffect } from 'react';
import type { InstrumentType } from '../../domain/types';
import type { Tuning } from '../../domain/tunings';
import { getDefaultTuning, getTuningsForInstrument, getTuningById } from '../../domain/tunings';

const STORAGE_KEY = 'tuner-selected-tunings';

export function useTuning(instrumentType: InstrumentType) {
    const [selectedTuning, setSelectedTuning] = useState<Tuning>(() => {
        // Try to load from localStorage
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const tunings = JSON.parse(stored);
                const tuningId = tunings[instrumentType];
                if (tuningId) {
                    const tuning = getTuningById(tuningId);
                    if (tuning) return tuning;
                }
            } catch {
                // Fall through to default
            }
        }
        return getDefaultTuning(instrumentType);
    });

    // Update tuning when instrument changes
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        let tuningId: string | null = null;

        if (stored) {
            try {
                const tunings = JSON.parse(stored);
                tuningId = tunings[instrumentType];
            } catch {
                // Ignore parsing errors
            }
        }

        if (tuningId) {
            const tuning = getTuningById(tuningId);
            if (tuning) {
                setSelectedTuning(tuning);
                return;
            }
        }

        // Fall back to default
        setSelectedTuning(getDefaultTuning(instrumentType));
    }, [instrumentType]);

    const changeTuning = (tuning: Tuning) => {
        setSelectedTuning(tuning);

        // Persist to localStorage
        const stored = localStorage.getItem(STORAGE_KEY);
        let tunings: Record<string, string> = {};

        if (stored) {
            try {
                tunings = JSON.parse(stored);
            } catch {
                // Start fresh
            }
        }

        tunings[instrumentType] = tuning.id;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tunings));
    };

    return {
        tuning: selectedTuning,
        availableTunings: getTuningsForInstrument(instrumentType),
        changeTuning,
    };
}
