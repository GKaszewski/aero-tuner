/**
 * Pure functions for calculating tuning state and accuracy.
 */

import type { TuningState } from './types';
import { frequencyToCents } from './note-converter';

// Threshold for considering a note "in tune" (±5 cents)
const IN_TUNE_THRESHOLD_CENTS = 5;

/**
 * Calculate the tuning state based on detected and target frequencies.
 * @param detectedFrequency - The frequency detected from audio input
 * @param targetFrequency - The target frequency for the note
 * @returns TuningState with status, cents deviation, and accuracy
 */
export function calculateTuningState(
    detectedFrequency: number,
    targetFrequency: number
): TuningState {
    const cents = frequencyToCents(detectedFrequency, targetFrequency);

    // Determine status
    let status: TuningState['status'];
    if (Math.abs(cents) <= IN_TUNE_THRESHOLD_CENTS) {
        status = 'in-tune';
    } else if (cents > 0) {
        status = 'sharp';
    } else {
        status = 'flat';
    }

    // Calculate accuracy (100% when perfectly in tune, decreases with deviation)
    // We'll use 50 cents as the reference point for 0% accuracy
    const accuracy = Math.max(0, Math.min(100, 100 - (Math.abs(cents) / 50) * 100));

    return {
        status,
        cents: Math.round(cents * 10) / 10, // Round to 1 decimal place
        accuracy: Math.round(accuracy),
    };
}

/**
 * Check if a frequency is within the "in tune" threshold.
 * @param detectedFrequency - The detected frequency
 * @param targetFrequency - The target frequency
 * @returns True if in tune
 */
export function isInTune(detectedFrequency: number, targetFrequency: number): boolean {
    const cents = Math.abs(frequencyToCents(detectedFrequency, targetFrequency));
    return cents <= IN_TUNE_THRESHOLD_CENTS;
}
