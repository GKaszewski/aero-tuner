/**
 * Pure domain logic for harmonic analysis.
 * Helps identify fundamental frequency from harmonics.
 */

/**
 * Check if two frequencies have a harmonic relationship.
 * @param f1 - First frequency
 * @param f2 - Second frequency
 * @param tolerance - Tolerance in cents (default 50)
 */
export function isHarmonic(f1: number, f2: number, tolerance: number = 50): boolean {
    const ratio = f2 / f1;
    const roundedRatio = Math.round(ratio);

    // Check if ratio is close to an integer (2x, 3x, 4x, etc.)
    if (roundedRatio < 2 || roundedRatio > 6) {
        return false;
    }

    // Calculate cents difference
    const expectedFreq = f1 * roundedRatio;
    const cents = 1200 * Math.log2(f2 / expectedFreq);

    return Math.abs(cents) < tolerance;
}

/**
 * Detect harmonic series from a list of frequency candidates.
 * Returns the fundamental frequency if a harmonic series is detected.
 */
export function detectHarmonicSeries(frequencies: number[]): number | null {
    if (frequencies.length < 2) {
        return null;
    }

    // Sort frequencies
    const sorted = [...frequencies].sort((a, b) => a - b);

    // Check if we have a harmonic series starting from the lowest frequency
    const fundamental = sorted[0];
    let harmonicCount = 1; // fundamental counts as first harmonic

    for (let i = 1; i < sorted.length; i++) {
        if (isHarmonic(fundamental, sorted[i])) {
            harmonicCount++;
        }
    }

    // If we found at least 2 harmonics (fundamental + 1 more), it's likely a harmonic series
    if (harmonicCount >= 2) {
        return fundamental;
    }

    return null;
}

/**
 * Find the fundamental frequency from a list of candidates.
 * Uses harmonic analysis to filter out overtones.
 */
export function findFundamentalFromHarmonics(candidates: number[]): number {
    if (candidates.length === 0) {
        return 0;
    }

    if (candidates.length === 1) {
        return candidates[0];
    }

    // Try to detect harmonic series
    const fundamental = detectHarmonicSeries(candidates);

    if (fundamental) {
        return fundamental;
    }

    // If no harmonic series detected, return the lowest frequency
    // (most conservative approach)
    return Math.min(...candidates);
}
