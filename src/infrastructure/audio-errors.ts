/**
 * Custom error types for audio-related errors.
 */

export class MicrophonePermissionError extends Error {
    constructor(message: string = 'Microphone permission denied') {
        super(message);
        this.name = 'MicrophonePermissionError';
    }
}

export class AudioContextError extends Error {
    constructor(message: string = 'Failed to create audio context') {
        super(message);
        this.name = 'AudioContextError';
    }
}

export class AudioNotSupportedError extends Error {
    constructor(message: string = 'Web Audio API not supported in this browser') {
        super(message);
        this.name = 'AudioNotSupportedError';
    }
}
