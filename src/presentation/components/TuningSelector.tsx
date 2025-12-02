/**
 * Tuning selector component with Tailwind styling.
 */

import type { Tuning } from '../../domain/tunings';

interface TuningSelectorProps {
    tunings: Tuning[];
    selectedTuning: Tuning;
    onChange: (tuning: Tuning) => void;
}

export function TuningSelector({ tunings, selectedTuning, onChange }: TuningSelectorProps) {
    // Don't show selector if there's only one tuning option
    if (tunings.length <= 1) {
        return null;
    }

    return (
        <div className="flex flex-col gap-2 w-full">
            <label className="text-sm font-semibold text-center" style={{ color: 'var(--color-primary-dark)' }}>
                Tuning
            </label>
            <select
                value={selectedTuning.id}
                onChange={(e) => {
                    const tuning = tunings.find(t => t.id === e.target.value);
                    if (tuning) onChange(tuning);
                }}
                className="px-4 py-3 rounded-xl font-semibold text-center cursor-pointer transition-all duration-300 border-2 shadow-[inset_0_1px_0_hsla(0,0%,100%,0.3),0_4px_8px_hsla(0,0%,0%,0.1)] hover:shadow-[inset_0_1px_0_hsla(0,0%,100%,0.3),0_6px_12px_hsla(0,0%,0%,0.15)] focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                    background: 'linear-gradient(135deg, hsla(0, 0%, 100%, 0.4) 0%, hsla(0, 0%, 100%, 0.2) 100%)',
                    backdropFilter: 'blur(15px)',
                    WebkitBackdropFilter: 'blur(15px)',
                    borderColor: 'hsla(0, 0%, 100%, 0.5)',
                    color: 'var(--color-primary-dark)'
                }}
            >
                {tunings.map((tuning) => (
                    <option key={tuning.id} value={tuning.id}>
                        {tuning.name} ({tuning.description})
                    </option>
                ))}
            </select>
        </div>
    );
}
