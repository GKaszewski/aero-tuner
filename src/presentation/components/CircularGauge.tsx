/**
 * Circular gauge component with Tailwind styling.
 */

import type { Note, TuningState } from '../../domain/types';
import { formatNote } from '../../domain/note-converter';

interface CircularGaugeProps {
    note: Note | null;
    tuningState: TuningState | null;
}

export function CircularGauge({ note, tuningState }: CircularGaugeProps) {
    // Calculate needle rotation
    const maxCents = 50;
    const cents = tuningState?.cents || 0;
    const clampedCents = Math.max(-maxCents, Math.min(maxCents, cents));
    const rotation = (clampedCents / maxCents) * 90;

    // Determine color based on tuning accuracy
    const getColorForCents = (cents: number) => {
        const absCents = Math.abs(cents);
        if (absCents <= 5) {
            // Perfect tune - bright green
            return {
                bg: 'linear-gradient(180deg, hsl(140, 70%, 45%) 0%, hsl(140, 75%, 35%) 100%)',
                text: 'hsl(140, 90%, 85%)',
                glow: '0 0 20px hsla(140, 80%, 50%, 0.6), 0 0 40px hsla(140, 80%, 50%, 0.3)'
            };
        } else if (absCents <= 15) {
            // Close - yellow
            return {
                bg: 'linear-gradient(180deg, hsl(50, 90%, 55%) 0%, hsl(50, 85%, 45%) 100%)',
                text: 'hsl(50, 95%, 90%)',
                glow: '0 0 20px hsla(50, 80%, 50%, 0.4)'
            };
        } else if (absCents <= 30) {
            // Getting further - orange
            return {
                bg: 'linear-gradient(180deg, hsl(30, 90%, 55%) 0%, hsl(30, 85%, 45%) 100%)',
                text: 'hsl(30, 95%, 90%)',
                glow: '0 0 20px hsla(30, 80%, 50%, 0.4)'
            };
        } else {
            // Too far - red
            return {
                bg: 'linear-gradient(180deg, hsl(0, 85%, 60%) 0%, hsl(0, 80%, 50%) 100%)',
                text: 'hsl(0, 95%, 95%)',
                glow: '0 0 20px hsla(0, 80%, 50%, 0.4)'
            };
        }
    };

    const colors = note && tuningState ? getColorForCents(cents) : {
        bg: 'linear-gradient(180deg, hsl(210, 60%, 35%) 0%, hsl(210, 65%, 25%) 100%)',
        text: 'hsl(190, 80%, 70%)',
        glow: 'none'
    };

    // Generate gauge marks
    const marks = [];
    for (let i = -50; i <= 50; i += 5) {
        const angle = (i / 50) * 90;
        const isMajor = i % 10 === 0;
        marks.push(
            <div
                key={i}
                className={`absolute top-2.5 left-1/2 origin-[50%_140px] -ml-px ${isMajor ? 'w-[3px] h-5 bg-[hsla(200,30%,30%,0.8)]' : 'w-0.5 h-3 bg-[hsla(200,30%,40%,0.6)]'}`}
                style={{ transform: `rotate(${angle}deg)` }}
            />
        );
    }

    // Generate labels  
    const labels = [
        { value: -20, angle: -36 },
        { value: 0, angle: 0 },
        { value: 20, angle: 36 },
        { value: 40, angle: 72 },
    ];

    return (
        <div className="w-[360px] h-[360px] my-1 mx-auto mb-2 relative md:w-[300px] md:h-[300px] md:my-2 max-md:w-[260px] max-md:h-[260px] max-md:my-0">
            <div
                className="w-full h-full rounded-full p-4 relative shadow-[inset_0_2px_4px_hsla(0,0%,0%,0.2),inset_0_-2px_4px_hsla(0,0%,100%,0.3),0_16px_32px_hsla(0,0%,0%,0.15)]"
                style={{ background: 'var(--gradient-gauge-bezel)' }}
            >
                <div
                    className="w-full h-full rounded-full relative overflow-hidden shadow-[inset_0_4px_8px_hsla(0,0%,100%,0.3),inset_0_-2px_4px_hsla(0,0%,0%,0.1)]"
                    style={{ background: 'var(--gradient-gauge-face)' }}
                >
                    {/* Gloss */}
                    <span className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

                    {/* Marks */}
                    <div className="absolute -inset-2 rounded-full">{marks}</div>

                    {/* Labels */}
                    <div className="absolute inset-0 pointer-events-none">
                        {labels.map(({ value, angle }) => {
                            const radius = 120;
                            const radian = (angle * Math.PI) / 180;
                            const x = 50 + radius * Math.sin(radian);
                            const y = 50 - radius * Math.cos(radian);

                            return (
                                <span
                                    key={value}
                                    className="absolute text-lg font-bold -translate-x-1/2 -translate-y-1/2"
                                    style={{
                                        left: `${x}%`,
                                        top: `${y}%`,
                                        color: 'hsla(200, 30%, 30%, 0.8)'
                                    }}
                                >
                                    {value}
                                </span>
                            );
                        })}
                    </div>

                    {/* Note display with color feedback */}
                    <div
                        className="absolute bottom-20 left-1/2 -translate-x-1/2 text-[2.5rem] font-extrabold px-6 py-2 rounded-xl min-w-[100px] text-center z-10 md:text-[2rem] md:bottom-[50px] max-md:text-[1.75rem] max-md:bottom-[50px] max-md:px-3 max-md:py-1 transition-all duration-300"
                        style={{
                            background: colors.bg,
                            color: colors.text,
                            boxShadow: `inset 0 1px 0 hsla(0, 0%, 100%, 0.1), inset 0 -2px 0 hsla(0, 0%, 0%, 0.3), 0 4px 8px hsla(0, 0%, 0%, 0.3), ${colors.glow}`
                        }}
                    >
                        {note ? formatNote(note) : '—'}
                    </div>

                    {/* Needle */}
                    <div
                        className="absolute bottom-1/2 left-1/2 w-1 h-[120px] -translate-x-1/2 rounded-t-sm transition-transform duration-500 shadow-[0_2px_4px_hsla(0,0%,0%,0.3)] z-[2] md:h-[100px] max-md:h-20"
                        style={{
                            background: 'linear-gradient(180deg, hsl(200, 80%, 45%) 0%, hsl(200, 75%, 40%) 80%, hsl(200, 70%, 35%) 100%)',
                            transform: `translateX(-50%) rotate(${rotation}deg)`,
                            transformOrigin: 'bottom center'
                        }}
                    />

                    {/* Center cap */}
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full shadow-[inset_0_2px_2px_hsla(0,0%,0%,0.3),0_2px_4px_hsla(0,0%,0%,0.2)] z-[3]"
                        style={{ background: 'linear-gradient(135deg, hsl(200, 20%, 60%) 0%, hsl(200, 15%, 50%) 100%)' }}
                    />
                </div>
            </div>
        </div>
    );
}
