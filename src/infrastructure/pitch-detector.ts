/**
 * Pitch detection using autocorrelation algorithm with harmonic analysis.
 * Based on the YIN algorithm with added harmonic detection for improved accuracy.
 */

import { findFundamentalFromHarmonics } from '../domain/harmonic-analyzer';

export class PitchDetector {
    private sampleRate: number;

    constructor(sampleRate: number = 44100) {
        this.sampleRate = sampleRate;
    }

    /**
     * Detect the pitch (fundamental frequency) from an audio buffer.
     * Uses harmonic analysis to improve accuracy.
     * @param buffer - Float32Array of audio samples
     * @returns Detected frequency in Hz, or null if no pitch detected
     */
    detectPitch(buffer: Float32Array): number | null {
        // Normalize the buffer
        const normalized = this.normalize(buffer);

        // Apply autocorrelation
        const correlations = this.autoCorrelate(normalized);

        if (!correlations) {
            return null;
        }

        // Find multiple correlation peaks (potential harmonics)
        const candidates = this.findCorrelationPeaks(correlations, 5);

        if (candidates.length === 0) {
            return null;
        }

        // Convert lags to frequencies
        const frequencies = candidates.map(lag => this.sampleRate / lag);

        // Use harmonic analysis to find the true fundamental
        const frequency = findFundamentalFromHarmonics(frequencies);

        // Filter out unrealistic frequencies (human hearing range ~20Hz to 4000Hz for tuning)
        if (frequency < 20 || frequency > 4000) {
            return null;
        }

        return frequency;
    }

    /**
     * Normalize audio buffer to range [-1, 1].
     */
    private normalize(buffer: Float32Array): Float32Array {
        const normalized = new Float32Array(buffer.length);
        let max = 0;

        // Find max absolute value
        for (let i = 0; i < buffer.length; i++) {
            const abs = Math.abs(buffer[i]);
            if (abs > max) {
                max = abs;
            }
        }

        // Normalize
        if (max > 0) {
            for (let i = 0; i < buffer.length; i++) {
                normalized[i] = buffer[i] / max;
            }
        } else {
            return buffer;
        }

        return normalized;
    }

    /**
     * Autocorrelation function to find periodic patterns in the signal.
     */
    private autoCorrelate(buffer: Float32Array): Float32Array | null {
        const size = buffer.length;
        const correlations = new Float32Array(size);

        // Calculate RMS (root mean square) to check if signal is strong enough
        let rms = 0;
        for (let i = 0; i < size; i++) {
            rms += buffer[i] * buffer[i];
        }
        rms = Math.sqrt(rms / size);

        // If signal is too weak, return null
        if (rms < 0.01) {
            return null;
        }

        // Autocorrelation
        for (let lag = 0; lag < size; lag++) {
            let sum = 0;
            for (let i = 0; i < size - lag; i++) {
                sum += buffer[i] * buffer[i + lag];
            }
            correlations[lag] = sum;
        }

        return correlations;
    }

    /**
     * Find multiple correlation peaks that could represent the fundamental or harmonics.
     * Returns an array of lag values sorted by correlation strength.
     */
    private findCorrelationPeaks(correlations: Float32Array, maxPeaks: number = 5): number[] {
        const size = correlations.length;
        const peaks: Array<{ lag: number; correlation: number }> = [];

        // Define search range
        const minLag = Math.floor(this.sampleRate / 1000); // ~44 for 44.1kHz
        const maxLag = Math.floor(this.sampleRate / 60);    // ~735 for 44.1kHz

        // Find first negative crossing after lag 0
        let negativeThreshold = -1;
        for (let i = 1; i < maxLag && i < size; i++) {
            if (correlations[i] < 0) {
                negativeThreshold = i;
                break;
            }
        }

        const startLag = negativeThreshold === -1 ? minLag : negativeThreshold;

        // Find all local maxima in the correlation function
        for (let lag = startLag + 1; lag < maxLag - 1 && lag < size - 1; lag++) {
            // Check if this is a local maximum
            if (correlations[lag] > correlations[lag - 1] &&
                correlations[lag] > correlations[lag + 1] &&
                correlations[lag] > correlations[0] * 0.3) { // At least 30% of zero-lag

                peaks.push({ lag, correlation: correlations[lag] });
            }
        }

        // Sort peaks by correlation strength (descending)
        peaks.sort((a, b) => b.correlation - a.correlation);

        // Return top N lag values
        return peaks.slice(0, maxPeaks).map(p => p.lag);
    }
}
