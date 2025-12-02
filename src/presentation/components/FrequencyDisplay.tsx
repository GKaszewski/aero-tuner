/**
 * Displays the detected frequency in Hz.
 */

interface FrequencyDisplayProps {
    frequency: number | null;
}

export function FrequencyDisplay({ frequency }: FrequencyDisplayProps) {
    return (
        <div className="text-center text-2xl font-semibold tabular-nums mt-0" style={{ color: 'var(--color-primary-dark)' }}>
            {frequency ? `${frequency.toFixed(1)} Hz` : '- - -'}
        </div>
    );
}
