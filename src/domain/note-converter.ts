/**
 * Pure functions for converting between frequencies and musical notes.
 * Uses equal temperament tuning (A4 = 440 Hz).
 */

import type { Note, NoteName } from './types';

const NOTE_NAMES: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// A4 is the reference pitch
const A4_FREQUENCY = 440;
const A4_MIDI_NUMBER = 69;

/**
 * Convert a frequency in Hz to the nearest musical note.
 * @param frequency - Frequency in Hz
 * @returns Note object with name, octave, and exact frequency
 */
export function frequencyToNote(frequency: number): Note | null {
    if (frequency <= 0 || !isFinite(frequency)) {
        return null;
    }

    // Calculate MIDI note number from frequency
    // Formula: n = 12 * log2(f / 440) + 69
    const midiNumber = Math.round(12 * Math.log2(frequency / A4_FREQUENCY) + A4_MIDI_NUMBER);

    // MIDI numbers range from 0 to 127
    if (midiNumber < 0 || midiNumber > 127) {
        return null;
    }

    const noteName = NOTE_NAMES[midiNumber % 12];
    const octave = Math.floor(midiNumber / 12) - 1;

    // Calculate the exact frequency for this note
    const exactFrequency = midiNumberToFrequency(midiNumber);

    return {
        name: noteName,
        octave,
        frequency: exactFrequency,
    };
}

/**
 * Convert MIDI note number to frequency in Hz.
 * @param midiNumber - MIDI note number (0-127)
 * @returns Frequency in Hz
 */
export function midiNumberToFrequency(midiNumber: number): number {
    // Formula: f = 440 * 2^((n - 69) / 12)
    return A4_FREQUENCY * Math.pow(2, (midiNumber - A4_MIDI_NUMBER) / 12);
}

/**
 * Calculate the deviation in cents between a detected frequency and target frequency.
 * A cent is 1/100th of a semitone.
 * @param detectedFrequency - The detected frequency in Hz
 * @param targetFrequency - The target frequency in Hz
 * @returns Deviation in cents (positive = sharp, negative = flat)
 */
export function frequencyToCents(detectedFrequency: number, targetFrequency: number): number {
    if (detectedFrequency <= 0 || targetFrequency <= 0) {
        return 0;
    }

    // Formula: cents = 1200 * log2(f1 / f2)
    return 1200 * Math.log2(detectedFrequency / targetFrequency);
}

/**
 * Get the note name and octave as a string (e.g., "A4", "C#3").
 * @param note - Note object
 * @returns Formatted note string
 */
export function formatNote(note: Note): string {
    return `${note.name}${note.octave}`;
}
