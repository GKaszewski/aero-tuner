/**
 * Instrument selector component with Tailwind styling.
 * Allows switching between guitar, piano, and ukulele.
 */

import type { InstrumentType } from '../../domain/types';

interface InstrumentSelectorProps {
    value: InstrumentType;
    onChange: (type: InstrumentType) => void;
}

const instruments: { type: InstrumentType; label: string; emoji: string }[] = [
    { type: 'guitar', label: 'Guitar', emoji: '🎸' },
    { type: 'piano', label: 'Piano', emoji: '🎹' },
    { type: 'ukulele', label: 'Ukulele', emoji: '🎻' },
];

export function InstrumentSelector({ value, onChange }: InstrumentSelectorProps) {
    return (
        <div className="flex gap-4 justify-center my-4">
            {instruments.map((instrument) => {
                const isActive = value === instrument.type;
                return (
                    <button
                        key={instrument.type}
                        className={`w-[90px] h-[90px] border-0 rounded-2xl text-[3.5rem] leading-none cursor-pointer transition-all duration-300 relative overflow-hidden flex items-center justify-center p-0 shadow-[inset_0_2px_0_hsla(0,0%,100%,0.4),inset_0_-3px_0_hsla(0,0%,0%,0.2),0_6px_12px_hsla(0,0%,0%,0.15)] hover:-translate-y-1 hover:shadow-[inset_0_2px_0_hsla(0,0%,100%,0.4),inset_0_-3px_0_hsla(0,0%,0%,0.2),0_10px_20px_hsla(0,0%,0%,0.2)] md:w-[75px] md:h-[75px] md:text-[2.8rem] max-md:w-[65px] max-md:h-[65px] max-md:text-[2.5rem]`}
                        onClick={() => onChange(instrument.type)}
                        aria-label={instrument.label}
                        title={instrument.label}
                        style={{
                            background: isActive ? 'var(--gradient-instrument-active)' : 'linear-gradient(135deg, hsl(200, 40%, 70%) 0%, hsl(200, 35%, 65%) 100%)',
                            boxShadow: isActive ? 'inset 0 2px 0 hsla(0, 0%, 100%, 0.5), inset 0 -3px 0 hsla(0, 0%, 0%, 0.25), 0 6px 12px hsla(50, 90%, 50%, 0.3), 0 0 20px hsla(50, 90%, 60%, 0.2)' : undefined
                        }}
                    >
                        <span className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/10 pointer-events-none" />
                        {instrument.emoji}
                    </button>
                );
            })}
        </div>
    );
}
