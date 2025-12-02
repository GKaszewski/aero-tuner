/**
 * Standard tuning configurations for different instruments.
 */

import type { InstrumentConfig, InstrumentType } from './types';

// Standard guitar tuning (6 strings, standard tuning E-A-D-G-B-E)
export const GUITAR_STANDARD: InstrumentConfig = {
    type: 'guitar',
    name: 'Guitar (Standard)',
    strings: [
        { name: 'E2', frequency: 82.41 },   // Low E
        { name: 'A2', frequency: 110.00 },  // A
        { name: 'D3', frequency: 146.83 },  // D
        { name: 'G3', frequency: 196.00 },  // G
        { name: 'B3', frequency: 246.94 },  // B
        { name: 'E4', frequency: 329.63 },  // High E
    ],
};

// Piano standard tuning (commonly tuned notes, middle octave)
export const PIANO_STANDARD: InstrumentConfig = {
    type: 'piano',
    name: 'Piano (Standard)',
    strings: [
        { name: 'C4', frequency: 261.63 },  // Middle C
        { name: 'D4', frequency: 293.66 },
        { name: 'E4', frequency: 329.63 },
        { name: 'F4', frequency: 349.23 },
        { name: 'G4', frequency: 392.00 },
        { name: 'A4', frequency: 440.00 },  // Concert A
        { name: 'B4', frequency: 493.88 },
        { name: 'C5', frequency: 523.25 },
    ],
};

// Standard ukulele tuning (4 strings, G-C-E-A)
export const UKULELE_STANDARD: InstrumentConfig = {
    type: 'ukulele',
    name: 'Ukulele (Standard)',
    strings: [
        { name: 'G4', frequency: 392.00 },  // G
        { name: 'C4', frequency: 261.63 },  // C
        { name: 'E4', frequency: 329.63 },  // E
        { name: 'A4', frequency: 440.00 },  // A
    ],
};

/**
 * Get the configuration for a specific instrument type.
 * @param type - The instrument type
 * @returns InstrumentConfig for the specified instrument
 */
export function getInstrumentConfig(type: InstrumentType): InstrumentConfig {
    switch (type) {
        case 'guitar':
            return GUITAR_STANDARD;
        case 'piano':
            return PIANO_STANDARD;
        case 'ukulele':
            return UKULELE_STANDARD;
        default:
            return GUITAR_STANDARD;
    }
}

/**
 * Get all available instrument configs.
 * @returns Array of all instrument configurations
 */
export function getAllInstruments(): InstrumentConfig[] {
    return [GUITAR_STANDARD, PIANO_STANDARD, UKULELE_STANDARD];
}
