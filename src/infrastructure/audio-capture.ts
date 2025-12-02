/**
 * Audio capture service using Web Audio API.
 * Handles microphone access and audio stream management.
 */

import {
    MicrophonePermissionError,
    AudioContextError,
    AudioNotSupportedError,
} from './audio-errors';

export type AudioDataCallback = (audioData: Float32Array) => void;

export class AudioCaptureService {
    private audioContext: AudioContext | null = null;
    private analyser: AnalyserNode | null = null;
    private microphone: MediaStreamAudioSourceNode | null = null;
    private mediaStream: MediaStream | null = null;
    private rafId: number | null = null;
    private callback: AudioDataCallback | null = null;

    /**
     * Start capturing audio from the microphone.
     * @throws MicrophonePermissionError if permission is denied
     * @throws AudioContextError if audio context creation fails
     * @throws AudioNotSupportedError if Web Audio API is not supported
     */
    async start(): Promise<void> {
        console.log('[AudioCapture] Starting...');

        // Check browser support
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new AudioNotSupportedError();
        }

        try {
            // Request microphone access
            console.log('[AudioCapture] Requesting microphone access...');
            this.mediaStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false,
                },
            });
            console.log('[AudioCapture] Microphone access granted');
        } catch (error) {
            console.error('[AudioCapture] Microphone access failed:', error);
            if (error instanceof Error && error.name === 'NotAllowedError') {
                throw new MicrophonePermissionError('Microphone access was denied');
            }
            throw new MicrophonePermissionError('Failed to access microphone');
        }

        try {
            // Create audio context
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            this.audioContext = new AudioContextClass();
            console.log('[AudioCapture] Audio context created, sample rate:', this.audioContext.sampleRate);

            // Create analyser node
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 4096; // Larger FFT for better low-frequency resolution
            this.analyser.smoothingTimeConstant = 0.8;

            // Connect microphone to analyser
            this.microphone = this.audioContext.createMediaStreamSource(this.mediaStream);
            this.microphone.connect(this.analyser);
            console.log('[AudioCapture] Audio nodes connected');

            // Start processing audio data
            console.log('[AudioCapture] Starting audio processing loop...');
            this.processAudio();
        } catch (error) {
            console.error('[AudioCapture] Audio context setup failed:', error);
            this.cleanup();
            throw new AudioContextError('Failed to initialize audio processing');
        }
    }

    /**
     * Stop capturing audio and release resources.
     */
    stop(): void {
        this.cleanup();
    }

    /**
     * Set callback to receive audio data.
     * @param callback - Function to call with audio data
     */
    onAudioData(callback: AudioDataCallback): void {
        console.log('[AudioCapture] Callback registered');
        this.callback = callback;
    }

    /**
     * Get the sample rate of the audio context.
     */
    getSampleRate(): number {
        return this.audioContext?.sampleRate ?? 44100;
    }

    /**
     * Get the AnalyserNode for FFT-based pitch detection.
     */
    getAnalyser(): AnalyserNode | null {
        return this.analyser;
    }

    /**
     * Check if currently capturing audio.
     */
    isActive(): boolean {
        return this.audioContext !== null && this.audioContext.state === 'running';
    }

    /**
     * Process audio data in a loop.
     */
    private processAudio = (): void => {
        // Always continue the loop if we have an analyser
        if (!this.analyser) {
            console.log('[AudioCapture] No analyser, stopping loop');
            return;
        }

        // Only process and send data if we have a callback (used by autocorrelation)
        // Note: FFT detection reads directly from the AnalyserNode, so callback may be null
        if (this.callback) {
            // Get time domain data (waveform)
            const bufferLength = this.analyser.fftSize;
            const dataArray = new Float32Array(bufferLength);
            this.analyser.getFloatTimeDomainData(dataArray);

            // Send data to callback
            this.callback(dataArray);
        }

        // Continue loop
        this.rafId = requestAnimationFrame(this.processAudio);
    };

    /**
     * Clean up resources.
     */
    private cleanup(): void {
        // Cancel animation frame
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }

        // Disconnect audio nodes
        if (this.microphone) {
            this.microphone.disconnect();
            this.microphone = null;
        }

        // Close audio context
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }

        // Stop media stream
        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach((track) => track.stop());
            this.mediaStream = null;
        }

        this.analyser = null;
        this.callback = null;
    }
}
