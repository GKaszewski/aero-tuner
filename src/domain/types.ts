/**
 * Core domain types for the tuner application.
 * Pure TypeScript with no external dependencies.
 */

export type InstrumentType = 'guitar' | 'piano' | 'ukulele';

export type NoteName = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

export interface Note {
    name: NoteName;
    octave: number;
    frequency: number;
}

export interface TuningState {
    status: 'in-tune' | 'sharp' | 'flat';
    cents: number; // Deviation in cents (-50 to +50)
    accuracy: number; // Percentage (0-100)
}

export interface StringConfig {
    name: string; // e.g., "E2", "A4"
    frequency: number; // Standard frequency in Hz
}

export interface InstrumentConfig {
    type: InstrumentType;
    name: string;
    strings: StringConfig[];
}

export interface TuningReading {
    detectedNote: Note | null;
    targetNote: Note | null;
    tuningState: TuningState | null;
    frequency: number | null;
}
