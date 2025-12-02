/**
 * String-by-string tuning guide component.
 * Shows all strings with visual status indicators.
 */

import type { Tuning } from '../../domain/tunings';

interface StringGuideProps {
    tuning: Tuning;
    detectedFrequency: number | null;
}

export function StringGuide({ tuning, detectedFrequency }: StringGuideProps) {
    // Find the closest string to the detected frequency
    const getStringStatus = (stringFreq: number) => {
        if (!detectedFrequency) {
            return { color: 'bg-gray-400/30', isClosest: false, diff: 0 };
        }

        const cents = 1200 * Math.log2(detectedFrequency / stringFreq);
        const absCents = Math.abs(cents);

        // Determine if this is the closest string
        const isClosest = tuning.strings.every(s =>
            Math.abs(detectedFrequency - stringFreq) <= Math.abs(detectedFrequency - s.frequency)
        );

        if (!isClosest) {
            return { color: 'bg-gray-400/30', isClosest: false, diff: cents };
        }

        // Color based on tuning accuracy
        let color = 'bg-gray-400/30';
        if (absCents <= 5) {
            color = 'bg-green-500/80';
        } else if (absCents <= 15) {
            color = 'bg-yellow-500/80';
        } else if (absCents <= 30) {
            color = 'bg-orange-500/80';
        } else {
            color = 'bg-red-500/80';
        }

        return { color, isClosest: true, diff: cents };
    };

    return (
        <div className="mx-auto w-[calc(100%-2rem)] md:w-md">
            <div className="bg-white/40 backdrop-blur-[15px] px-4 py-3 rounded-xl border border-white/50 shadow-[0_4px_16px_hsla(0,0%,0%,0.08),inset_0_1px_0_hsla(0,0%,100%,0.5)]">
                <div className="flex flex-col gap-2">
                    {tuning.strings.map((string, index) => {
                        const status = getStringStatus(string.frequency);

                        return (
                            <div
                                key={`${string.name}-${index}`}
                                className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-300 ${status.isClosest ? 'bg-white/50 scale-105' : 'bg-white/20'
                                    }`}
                            >
                                {/* String name */}
                                <div className="w-12 text-center font-bold text-sm" style={{ color: 'var(--color-primary-dark)' }}>
                                    {string.name}
                                </div>

                                {/* Visual string line */}
                                <div className="flex-1 relative h-3 bg-gradient-to-r from-gray-400/40 to-gray-500/40 rounded-full overflow-hidden shadow-inner">
                                    {/* Status indicator */}
                                    {status.isClosest && (
                                        <div
                                            className={`absolute top-0 left-0 h-full ${status.color} transition-all duration-300 rounded-full`}
                                            style={{
                                                width: `${Math.min(100, 100 - Math.abs(status.diff) * 2)}%`,
                                                boxShadow: status.color.includes('green') ? '0 0 8px rgba(34, 197, 94, 0.6)' : undefined
                                            }}
                                        />
                                    )}
                                </div>

                                {/* Frequency */}
                                <div className="w-16 text-right text-xs opacity-70">
                                    {string.frequency.toFixed(0)} Hz
                                </div>

                                {/* Cents indicator */}
                                {status.isClosest && detectedFrequency && (
                                    <div className="w-12 text-right text-xs font-semibold">
                                        {status.diff > 0 ? '+' : ''}{status.diff.toFixed(0)}¢
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
