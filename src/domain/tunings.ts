/**
 * Alternate tuning configurations for different instruments.
 */

import type { InstrumentType, StringConfig } from './types';

export interface Tuning {
    id: string;
    name: string;
    description: string;
    strings: StringConfig[];
}

// ===== GUITAR TUNINGS =====

export const GUITAR_STANDARD: Tuning = {
    id: 'guitar-standard',
    name: 'Standard',
    description: 'E A D G B E',
    strings: [
        { name: 'E2', frequency: 82.41 },
        { name: 'A2', frequency: 110.00 },
        { name: 'D3', frequency: 146.83 },
        { name: 'G3', frequency: 196.00 },
        { name: 'B3', frequency: 246.94 },
        { name: 'E4', frequency: 329.63 },
    ],
};

export const GUITAR_DROP_D: Tuning = {
    id: 'guitar-drop-d',
    name: 'Drop D',
    description: 'D A D G B E',
    strings: [
        { name: 'D2', frequency: 73.42 },   // Dropped a whole step
        { name: 'A2', frequency: 110.00 },
        { name: 'D3', frequency: 146.83 },
        { name: 'G3', frequency: 196.00 },
        { name: 'B3', frequency: 246.94 },
        { name: 'E4', frequency: 329.63 },
    ],
};

export const GUITAR_DROP_C: Tuning = {
    id: 'guitar-drop-c',
    name: 'Drop C',
    description: 'C G C F A D',
    strings: [
        { name: 'C2', frequency: 65.41 },
        { name: 'G2', frequency: 98.00 },
        { name: 'C3', frequency: 130.81 },
        { name: 'F3', frequency: 174.61 },
        { name: 'A3', frequency: 220.00 },
        { name: 'D4', frequency: 293.66 },
    ],
};

export const GUITAR_DADGAD: Tuning = {
    id: 'guitar-dadgad',
    name: 'DADGAD',
    description: 'D A D G A D',
    strings: [
        { name: 'D2', frequency: 73.42 },
        { name: 'A2', frequency: 110.00 },
        { name: 'D3', frequency: 146.83 },
        { name: 'G3', frequency: 196.00 },
        { name: 'A3', frequency: 220.00 },
        { name: 'D4', frequency: 293.66 },
    ],
};

export const GUITAR_OPEN_G: Tuning = {
    id: 'guitar-open-g',
    name: 'Open G',
    description: 'D G D G B D',
    strings: [
        { name: 'D2', frequency: 73.42 },
        { name: 'G2', frequency: 98.00 },
        { name: 'D3', frequency: 146.83 },
        { name: 'G3', frequency: 196.00 },
        { name: 'B3', frequency: 246.94 },
        { name: 'D4', frequency: 293.66 },
    ],
};

export const GUITAR_OPEN_D: Tuning = {
    id: 'guitar-open-d',
    name: 'Open D',
    description: 'D A D F# A D',
    strings: [
        { name: 'D2', frequency: 73.42 },
        { name: 'A2', frequency: 110.00 },
        { name: 'D3', frequency: 146.83 },
        { name: 'F#3', frequency: 185.00 },
        { name: 'A3', frequency: 220.00 },
        { name: 'D4', frequency: 293.66 },
    ],
};

// ===== UKULELE TUNINGS =====

export const UKULELE_STANDARD: Tuning = {
    id: 'ukulele-standard',
    name: 'Standard (C)',
    description: 'G C E A',
    strings: [
        { name: 'G4', frequency: 392.00 },
        { name: 'C4', frequency: 261.63 },
        { name: 'E4', frequency: 329.63 },
        { name: 'A4', frequency: 440.00 },
    ],
};

export const UKULELE_D_TUNING: Tuning = {
    id: 'ukulele-d',
    name: 'D Tuning',
    description: 'A D F# B',
    strings: [
        { name: 'A4', frequency: 440.00 },
        { name: 'D4', frequency: 293.66 },
        { name: 'F#4', frequency: 369.99 },
        { name: 'B4', frequency: 493.88 },
    ],
};

export const UKULELE_BARITONE: Tuning = {
    id: 'ukulele-baritone',
    name: 'Baritone',
    description: 'D G B E',
    strings: [
        { name: 'D3', frequency: 146.83 },
        { name: 'G3', frequency: 196.00 },
        { name: 'B3', frequency: 246.94 },
        { name: 'E4', frequency: 329.63 },
    ],
};

// ===== PIANO TUNINGS =====
// Piano doesn't have alternate tunings, but we keep it for completeness
export const PIANO_STANDARD: Tuning = {
    id: 'piano-standard',
    name: 'Standard',
    description: 'A440 Concert Pitch',
    strings: [
        { name: 'C4', frequency: 261.63 },
        { name: 'D4', frequency: 293.66 },
        { name: 'E4', frequency: 329.63 },
        { name: 'F4', frequency: 349.23 },
        { name: 'G4', frequency: 392.00 },
        { name: 'A4', frequency: 440.00 },
        { name: 'B4', frequency: 493.88 },
        { name: 'C5', frequency: 523.25 },
    ],
};

// ===== TUNING MAPS =====

export const GUITAR_TUNINGS: Tuning[] = [
    GUITAR_STANDARD,
    GUITAR_DROP_D,
    GUITAR_DROP_C,
    GUITAR_DADGAD,
    GUITAR_OPEN_G,
    GUITAR_OPEN_D,
];

export const UKULELE_TUNINGS: Tuning[] = [
    UKULELE_STANDARD,
    UKULELE_D_TUNING,
    UKULELE_BARITONE,
];

export const PIANO_TUNINGS: Tuning[] = [PIANO_STANDARD];

/**
 * Get available tunings for a specific instrument type.
 */
export function getTuningsForInstrument(instrumentType: InstrumentType): Tuning[] {
    switch (instrumentType) {
        case 'guitar':
            return GUITAR_TUNINGS;
        case 'ukulele':
            return UKULELE_TUNINGS;
        case 'piano':
            return PIANO_TUNINGS;
        default:
            return GUITAR_TUNINGS;
    }
}

/**
 * Get the default tuning for an instrument.
 */
export function getDefaultTuning(instrumentType: InstrumentType): Tuning {
    switch (instrumentType) {
        case 'guitar':
            return GUITAR_STANDARD;
        case 'ukulele':
            return UKULELE_STANDARD;
        case 'piano':
            return PIANO_STANDARD;
        default:
            return GUITAR_STANDARD;
    }
}

/**
 * Find a tuning by ID.
 */
export function getTuningById(id: string): Tuning | null {
    const allTunings = [...GUITAR_TUNINGS, ...UKULELE_TUNINGS, ...PIANO_TUNINGS];
    return allTunings.find(t => t.id === id) || null;
}
