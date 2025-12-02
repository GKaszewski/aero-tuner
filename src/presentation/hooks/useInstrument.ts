/**
 * Hook for managing instrument selection.
 */

import { useState } from 'react';
import type { InstrumentType, InstrumentConfig } from '../../domain/types';
import { getInstrumentConfig } from '../../domain/instruments';

interface UseInstrumentResult {
    instrument: InstrumentType;
    setInstrument: (type: InstrumentType) => void;
    config: InstrumentConfig;
}

export function useInstrument(initialInstrument: InstrumentType = 'guitar'): UseInstrumentResult {
    const [instrument, setInstrument] = useState<InstrumentType>(initialInstrument);
    const config = getInstrumentConfig(instrument);

    return {
        instrument,
        setInstrument,
        config,
    };
}
