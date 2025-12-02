/**
 * Real-time waveform display component using Canvas.
 */

import { useEffect, useRef } from 'react';
import type { AudioCaptureService } from '../../infrastructure/audio-capture';

interface WaveformDisplayProps {
    audioService: AudioCaptureService | null;
    isActive: boolean;
}

export function WaveformDisplay({ audioService, isActive }: WaveformDisplayProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafIdRef = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !audioService || !isActive) {
            return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const analyser = audioService.getAnalyser();
        if (!analyser) return;

        const bufferLength = analyser.fftSize;
        const dataArray = new Float32Array(bufferLength);

        // Set canvas size
        const resizeCanvas = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * window.devicePixelRatio;
            canvas.height = rect.height * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const draw = () => {
            if (!isActive) return;

            // Get waveform data
            analyser.getFloatTimeDomainData(dataArray);

            const width = canvas.width / window.devicePixelRatio;
            const height = canvas.height / window.devicePixelRatio;

            // Clear canvas with gradient background
            const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
            bgGradient.addColorStop(0, 'hsla(200, 60%, 30%, 0.2)');
            bgGradient.addColorStop(1, 'hsla(200, 60%, 20%, 0.3)');
            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, width, height);

            // Draw waveform
            const sliceWidth = width / bufferLength;
            let x = 0;

            // Create gradient for waveform
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, 'hsl(180, 80%, 60%)');
            gradient.addColorStop(0.5, 'hsl(200, 80%, 50%)');
            gradient.addColorStop(1, 'hsl(220, 80%, 40%)');

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
            ctx.shadowBlur = 4;
            ctx.shadowColor = 'hsla(200, 80%, 50%, 0.5)';
            ctx.beginPath();

            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i];
                const y = (v + 1) * height / 2; // Convert from [-1, 1] to [0, height]

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }

                x += sliceWidth;
            }

            ctx.stroke();
            ctx.shadowBlur = 0;

            rafIdRef.current = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (rafIdRef.current !== null) {
                cancelAnimationFrame(rafIdRef.current);
                rafIdRef.current = null;
            }
        };
    }, [audioService, isActive]);

    if (!isActive) {
        return null;
    }

    return (
        <div className="mx-auto w-[calc(100%-2rem)] md:w-md">
            <div className="bg-white/40 backdrop-blur-[15px] rounded-xl border border-white/50 shadow-[0_4px_16px_hsla(0,0%,0%,0.08),inset_0_1px_0_hsla(0,0%,100%,0.5)] overflow-hidden">
                <canvas
                    ref={canvasRef}
                    className="w-full h-20 block"
                    style={{ imageRendering: 'auto' }}
                />
            </div>
        </div>
    );
}
