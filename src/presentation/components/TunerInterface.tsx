/**
 * Main tuner interface with Tailwind styling.
 */

import { useState, useEffect } from 'react';
import { useTuner } from '../hooks/useTuner';
import { useInstrument } from '../hooks/useInstrument';
import { useTuning } from '../hooks/useTuning';
import { Button } from './Button';
import { FrequencyDisplay } from './FrequencyDisplay';
import { CircularGauge } from './CircularGauge';
import { InstrumentSelector } from './InstrumentSelector';
import { TuningSelector } from './TuningSelector';
import { ErrorMessage } from './ErrorMessage';
import { StringGuide } from './StringGuide';
import { WaveformDisplay } from './WaveformDisplay';
import Header from './Header';

export function TunerInterface() {
    const { instrument, setInstrument } = useInstrument();
    const { tuning, availableTunings, changeTuning } = useTuning(instrument);
    const { isActive, error, start, stop, frequency, note, tuningState, audioService } = useTuner(tuning);

    // Persisted state for Pro Mode
    const [isProMode, setIsProMode] = useState(() => {
        const saved = localStorage.getItem('aero-tuner-pro-mode');
        return saved !== null ? JSON.parse(saved) : false;
    });

    useEffect(() => {
        localStorage.setItem('aero-tuner-pro-mode', JSON.stringify(isProMode));
    }, [isProMode]);

    const handleToggle = () => {
        if (isActive) {
            stop();
        } else {
            start();
        }
    };

    const instrumentConfig = {
        name: tuning.name,
        type: instrument
    };

    const status = error ? 'error' : isActive ? 'listening' : 'idle';

    return (
        <>
            {/* Header */}
            <Header status={status} />

            <div className="max-w-full bg-white/15 backdrop-blur-[20px] h-full min-h-[calc(100vh-80px)] pb-4">
                <div className="flex flex-col gap-4 md:gap-2 max-md:gap-1">
                    {/* Error */}
                    {error && <ErrorMessage error={error} onRetry={handleToggle} />}

                    {/* Gauge */}
                    <CircularGauge note={note} tuningState={tuningState} />

                    {/* Frequency */}
                    <FrequencyDisplay frequency={frequency} />

                    {/* String Guide (Pro Only) */}
                    {isProMode && (
                        <StringGuide tuning={tuning} detectedFrequency={frequency} />
                    )}

                    {/* Instruments */}
                    <InstrumentSelector value={instrument} onChange={setInstrument} />

                    {/* Button */}
                    <div className="flex items-center justify-center flex-col gap-4 md:gap-4">
                        <Button onClick={handleToggle} variant="primary">
                            {isActive ? 'Stop' : 'Tune'}
                        </Button>
                    </div>

                    {/* Waveform Display (Pro Only) */}
                    {isProMode && (
                        <WaveformDisplay audioService={audioService} isActive={isActive} />
                    )}

                    {/* Info */}
                    <div className="md:w-md bg-white/40 backdrop-blur-[15px] px-4 py-2 rounded-xl border border-white/50 shadow-[0_4px_16px_hsla(0,0%,0%,0.08),inset_0_1px_0_hsla(0,0%,100%,0.5)] text-center max-md:px-2 max-md:py-1 max-md:text-sm mt-3 mx-auto">
                        <p>
                            <strong>{instrumentConfig.name}</strong>
                        </p>
                        <p className="mt-1 text-sm">
                            {isActive
                                ? 'Play a note on your instrument'
                                : 'Click Tune to begin'}
                        </p>
                    </div>

                    {/* Pro Controls */}
                    <div className="mx-auto md:w-md flex flex-col gap-4">
                        {/* Tuning Selector (Pro Only) */}
                        {isProMode && (
                            <TuningSelector
                                tunings={availableTunings}
                                selectedTuning={tuning}
                                onChange={changeTuning}
                            />
                        )}

                        {/* Mode Toggle */}
                        <button
                            onClick={() => setIsProMode(!isProMode)}
                            className="text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center justify-center gap-2 opacity-70 hover:opacity-100 py-2"
                        >
                            <span className={!isProMode ? 'font-bold text-blue-600' : ''}>Basic</span>
                            <div className={`w-8 h-4 rounded-full relative transition-colors duration-300 ${isProMode ? 'bg-blue-500' : 'bg-gray-300'}`}>
                                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-300 ${isProMode ? 'left-4.5' : 'left-0.5'}`} />
                            </div>
                            <span className={isProMode ? 'font-bold text-blue-600' : ''}>Pro</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
