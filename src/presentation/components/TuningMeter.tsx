/**
 * Visual gauge showing tuning accuracy.
 * Displays deviation from target pitch.
 */

import type { TuningState } from '../../domain/types';

interface TuningMeterProps {
    tuningState: TuningState | null;
}

export function TuningMeter({ tuningState }: TuningMeterProps) {
    if (!tuningState) {
        return (
            <div className="tuning-meter">
                <div className="tuning-meter-center" />
                <div className="tuning-meter-labels">
                    <span>Flat</span>
                    <span>In Tune</span>
                    <span>Sharp</span>
                </div>
            </div>
        );
    }

    // Calculate meter position (-50 to +50 cents -> 0% to 100%)
    const maxCents = 50;
    const clampedCents = Math.max(-maxCents, Math.min(maxCents, tuningState.cents));
    const position = 50 + (clampedCents / maxCents) * 50; // 0-100%

    return (
        <div className="tuning-meter">
            <div
                className={`tuning-meter-bar ${tuningState.status}`}
                style={{ left: `${position}%` }}
            />
            <div className="tuning-meter-center" />
            <div className="tuning-meter-labels">
                <span>Flat</span>
                <span>{tuningState.cents > 0 ? '+' : ''}{tuningState.cents}¢</span>
                <span>Sharp</span>
            </div>
        </div>
    );
}
