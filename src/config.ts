/**
 * Centralized configuration for the AeroTuner application.
 */

export const config = {
    audio: {
        sampleRate: 48000,
        fftSize: 2048,
        smoothingTimeConstant: 0.8,
    },
    pitchDetection: {
        minFrequency: 60, // Hz (Low B on 5-string bass is ~30Hz, but 60Hz is safer for noise)
        maxFrequency: 4000, // Hz (High C on piano is ~4186Hz)
        clarityThreshold: 0.9, // Correlation threshold for autocorrelation
        silenceThreshold: 0.05, // Amplitude threshold to consider "silence"
        fftPeakThreshold: 0.05, // 5% of max magnitude
    },
    tuning: {
        referencePitch: 440, // A4 frequency
        inTuneThresholdCents: 5, // ±5 cents is considered "in tune"
    },
    ui: {
        gaugeRangeCents: 50, // Range of the tuning gauge in cents (±50)
        animationSmoothing: 0.2, // Smoothing factor for UI updates
    }
} as const;
