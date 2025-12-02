/**
 * FFT-based pitch detection using Web Audio API.
 * Uses Harmonic Product Spectrum (HPS) for fundamental frequency detection.
 */

import { findFundamentalFromHarmonics } from '../domain/harmonic-analyzer';

export class FFTPitchDetector {
    private analyser: AnalyserNode;
    private sampleRate: number;
    private frequencyData: Float32Array;
    private bufferLength: number;

    constructor(analyser: AnalyserNode, sampleRate: number) {
        this.analyser = analyser;
        this.sampleRate = sampleRate;
        this.bufferLength = analyser.frequencyBinCount;
        this.frequencyData = new Float32Array(this.bufferLength);
    }

    /**
     * Detect pitch using FFT frequency analysis.
     * @returns Detected frequency in Hz, or null if no pitch detected
     */
    detectPitch(): number | null {
        // Get frequency data from analyser
        this.analyser.getFloatFrequencyData(this.frequencyData as any);

        // Convert dB to linear magnitude
        const magnitude = this.convertToMagnitude(this.frequencyData) as Float32Array;

        // Find peak frequencies
        const peaks = this.findPeaks(magnitude, 5);

        if (peaks.length === 0) {
            return null;
        }

        // Convert bin indices to frequencies
        const frequencies = peaks.map(binIndex => this.binToFrequency(binIndex));

        // Use harmonic analysis to find fundamental
        const frequency = findFundamentalFromHarmonics(frequencies);

        // Apply Harmonic Product Spectrum for more accuracy
        const hpsFrequency = this.harmonicProductSpectrum(magnitude);

        // If HPS found a fundamental and it's lower, prefer it
        if (hpsFrequency && hpsFrequency < frequency) {
            return hpsFrequency;
        }

        // Filter unrealistic frequencies (60 Hz to 4000 Hz for musical instruments)
        if (frequency < 60 || frequency > 4000) {
            return null;
        }

        return frequency;
    }

    /**
     * Convert frequency data from dB to linear magnitude.
     */
    private convertToMagnitude(dbData: Float32Array): Float32Array {
        const magnitude = new Float32Array(dbData.length);

        for (let i = 0; i < dbData.length; i++) {
            // Convert dB to linear: magnitude = 10^(dB/20)
            magnitude[i] = Math.pow(10, dbData[i] / 20);
        }

        return magnitude;
    }

    /**
     * Find peaks in the magnitude spectrum.
     */
    private findPeaks(magnitude: Float32Array, maxPeaks: number = 5): number[] {
        const peaks: Array<{ bin: number; magnitude: number }> = [];

        // Find max magnitude for dynamic thresholding
        let maxMag = 0;
        for (let i = 0; i < magnitude.length; i++) {
            if (magnitude[i] > maxMag) {
                maxMag = magnitude[i];
            }
        }

        // Use dynamic threshold (5% of max magnitude)
        const minMagnitude = maxMag * 0.05;

        // Define frequency range for musical instruments (60 Hz to 4000 Hz)
        const minFreq = 60; // Lowest note we care about
        const maxFreq = 4000;
        const minBin = Math.floor(minFreq * this.bufferLength / (this.sampleRate / 2));
        const maxBin = Math.floor(maxFreq * this.bufferLength / (this.sampleRate / 2));

        // Find local maxima in the valid frequency range
        for (let i = Math.max(1, minBin); i < Math.min(magnitude.length - 1, maxBin); i++) {
            if (magnitude[i] > magnitude[i - 1] &&
                magnitude[i] > magnitude[i + 1] &&
                magnitude[i] > minMagnitude) {

                // Use parabolic interpolation for sub-bin accuracy
                const refinedBin = this.parabolicInterpolation(magnitude, i);
                peaks.push({ bin: refinedBin, magnitude: magnitude[i] });
            }
        }

        // Sort by magnitude (descending)
        peaks.sort((a, b) => b.magnitude - a.magnitude);

        // Return top N peaks
        return peaks.slice(0, maxPeaks).map(p => p.bin);
    }

    /**
     * Parabolic interpolation for sub-bin frequency accuracy.
     */
    private parabolicInterpolation(magnitude: Float32Array, index: number): number {
        if (index <= 0 || index >= magnitude.length - 1) {
            return index;
        }

        const alpha = magnitude[index - 1];
        const beta = magnitude[index];
        const gamma = magnitude[index + 1];

        const p = 0.5 * (alpha - gamma) / (alpha - 2 * beta + gamma);

        return index + p;
    }

    /**
     * Harmonic Product Spectrum algorithm for fundamental detection.
     * Downsamples and multiplies the spectrum to enhance the fundamental.
     */
    private harmonicProductSpectrum(magnitude: Float32Array): number | null {
        const hpsLength = Math.floor(magnitude.length / 5);
        const hps = new Float32Array(hpsLength);

        // Initialize HPS with first spectrum
        for (let i = 0; i < hpsLength; i++) {
            hps[i] = magnitude[i];
        }

        // Multiply with downsampled versions (harmonics 2x, 3x, 4x, 5x)
        for (let harmonic = 2; harmonic <= 5; harmonic++) {
            for (let i = 0; i < hpsLength; i++) {
                const bin = i * harmonic;
                if (bin < magnitude.length) {
                    hps[i] *= magnitude[bin];
                }
            }
        }

        // Find the peak in HPS (this is likely the fundamental)
        let maxBin = 0;
        let maxValue = hps[0];
        const minBin = Math.floor(20 * hpsLength / (this.sampleRate / 2)); // Skip very low frequencies

        for (let i = minBin; i < hpsLength; i++) {
            if (hps[i] > maxValue) {
                maxValue = hps[i];
                maxBin = i;
            }
        }

        // Check if peak is strong enough
        if (maxValue < 0.01) {
            return null;
        }

        // Use parabolic interpolation for accuracy
        const refinedBin = this.parabolicInterpolation(hps, maxBin);

        return this.binToFrequency(refinedBin);
    }

    /**
     * Convert FFT bin index to frequency in Hz.
     */
    private binToFrequency(bin: number): number {
        return bin * this.sampleRate / (2 * this.bufferLength);
    }
}
