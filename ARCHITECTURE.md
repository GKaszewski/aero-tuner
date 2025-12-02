# Tuner App - Architecture Documentation

## Clean Architecture Diagram

```mermaid
graph TB
    subgraph "Presentation Layer"
        UI[TunerInterface Component]
        Hooks[Custom Hooks<br/>useTuner, useAudioCapture, etc.]
        Components[Dumb Components<br/>Button, NoteDisplay, etc.]
    end
    
    subgraph "Domain Layer - Pure Business Logic"
        Types[types.ts<br/>Core Type Definitions]
        NoteConverter[note-converter.ts<br/>Frequency ↔ Note]
        TuningCalc[tuning-calculator.ts<br/>Sharp/Flat/InTune Logic]
        Instruments[instruments.ts<br/>Instrument Configs]
    end
    
    subgraph "Infrastructure Layer - External Services"
        AudioCapture[AudioCaptureService<br/>Web Audio API Wrapper]
        PitchDetector[PitchDetector<br/>Autocorrelation Algorithm]
        Errors[Custom Error Types]
    end
    
    subgraph "External APIs"
        WebAudio[Web Audio API]
        Microphone[Device Microphone]
    end
    
    UI --> Hooks
    Hooks --> Components
    Hooks --> TuningCalc
    Hooks --> NoteConverter
    Hooks --> Instruments
    Hooks --> AudioCapture
    Hooks --> PitchDetector
    
    AudioCapture --> WebAudio
    WebAudio --> Microphone
    
    TuningCalc --> NoteConverter
    TuningCalc --> Types
    NoteConverter --> Types
    Instruments --> Types
    PitchDetector --> Errors
    AudioCapture --> Errors
    
    style UI fill:#00bfff,stroke:#0080ff,stroke-width:2px
    style Hooks fill:#87ceeb,stroke:#4682b4,stroke-width:2px
    style Components fill:#b0e0e6,stroke:#4682b4,stroke-width:2px
    
    style Types fill:#98fb98,stroke:#228b22,stroke-width:2px
    style NoteConverter fill:#98fb98,stroke:#228b22,stroke-width:2px
    style TuningCalc fill:#98fb98,stroke:#228b22,stroke-width:2px
    style Instruments fill:#98fb98,stroke:#228b22,stroke-width:2px
    
    style AudioCapture fill:#ffd700,stroke:#ff8c00,stroke-width:2px
    style PitchDetector fill:#ffd700,stroke:#ff8c00,stroke-width:2px
    style Errors fill:#ffd700,stroke:#ff8c00,stroke-width:2px
```

## Dependency Flow

The architecture strictly enforces the dependency rule:

```
Presentation → Domain ← Infrastructure
     ↓                      ↓
     → Infrastructure →  External APIs
```

### Key Rules

1. **Domain has zero dependencies** - Pure TypeScript, no React, no external libraries
2. **Infrastructure depends on external APIs** - Web Audio API, browser APIs
3. **Presentation depends on both** - Uses hooks to orchestrate domain + infrastructure
4. **Components are pure** - Only receive props, no business logic

## Data Flow Example

User clicks "Start Tuning":

```mermaid
sequenceDiagram
    participant User
    participant TunerInterface
    participant useTuner
    participant AudioCapture
    participant PitchDetector
    participant NoteConverter
    participant TuningCalc
    
    User->>TunerInterface: Click "Start"
    TunerInterface->>useTuner: start()
    useTuner->>AudioCapture: start()
    AudioCapture->>Browser: Request mic permission
    Browser-->>User: Permission dialog
    User-->>Browser: Grant permission
    Browser-->>AudioCapture: MediaStream
    
    loop Real-time processing
        AudioCapture->>useTuner: Audio samples
        useTuner->>PitchDetector: detectPitch(samples)
        PitchDetector-->>useTuner: frequency (Hz)
        useTuner->>NoteConverter: frequencyToNote(Hz)
        NoteConverter-->>useTuner: note {name, octave}
        useTuner->>TuningCalc: calculateTuningState()
        TuningCalc-->>useTuner: {status, cents, accuracy}
        useTuner-->>TunerInterface: Update state
        TunerInterface-->>User: Display note & meter
    end
```

## Component Composition

The UI is built through composition of small, focused components:

```mermaid
graph TD
    TunerInterface[TunerInterface]
    
    TunerInterface --> InstrumentSelector
    TunerInterface --> ErrorMessage
    TunerInterface --> DisplayPanel[Display Panel]
    TunerInterface --> Button
    TunerInterface --> StatusIndicator
    
    DisplayPanel --> NoteDisplay
    DisplayPanel --> FrequencyDisplay
    DisplayPanel --> TuningMeter
    
    style TunerInterface fill:#00bfff,stroke:#0080ff,stroke-width:3px
    style InstrumentSelector fill:#87ceeb,stroke:#4682b4
    style ErrorMessage fill:#87ceeb,stroke:#4682b4
    style DisplayPanel fill:#87ceeb,stroke:#4682b4
    style Button fill:#87ceeb,stroke:#4682b4
    style StatusIndicator fill:#87ceeb,stroke:#4682b4
    style NoteDisplay fill:#b0e0e6,stroke:#4682b4
    style FrequencyDisplay fill:#b0e0e6,stroke:#4682b4
    style TuningMeter fill:#b0e0e6,stroke:#4682b4
```

## File Organization

```
src/
├── domain/                    # 🟢 Pure Logic (Green)
│   ├── types.ts              # Type definitions
│   ├── note-converter.ts     # Mathematical conversions
│   ├── tuning-calculator.ts  # Tuning logic
│   └── instruments.ts        # Configuration data
│
├── infrastructure/            # 🟡 External Services (Gold)
│   ├── audio-capture.ts      # Microphone access
│   ├── pitch-detector.ts     # Signal processing
│   └── audio-errors.ts       # Error handling
│
├── presentation/              # 🔵 UI Layer (Blue)
│   ├── hooks/                # Smart - contain logic
│   │   ├── useAudioCapture.ts
│   │   ├── usePitchDetection.ts
│   │   ├── useInstrument.ts
│   │   └── useTuner.ts
│   │
│   └── components/           # Dumb - only presentation
│       ├── Button.tsx
│       ├── FrequencyDisplay.tsx
│       ├── NoteDisplay.tsx
│       ├── TuningMeter.tsx
│       ├── InstrumentSelector.tsx
│       ├── StatusIndicator.tsx
│       ├── ErrorMessage.tsx
│       └── TunerInterface.tsx
│
├── styles/                   # Design system
│   └── components.css
│
├── index.css                 # Frutiger Aero design tokens
├── App.tsx                   # Root component
└── main.tsx                  # Entry point
```

## Benefits of This Architecture

### Testability
- Domain logic can be unit tested without React
- Infrastructure can be mocked for testing
- Components can be tested in isolation

### Maintainability
- Clear separation makes changes easier
- Each layer has a single responsibility
- Dependencies flow in one direction

### Scalability
- Easy to add new instruments (just update domain)
- Can swap pitch detection algorithms (infrastructure)
- Can redesign UI without touching logic (presentation)

### Reusability
- Domain logic could be used in a mobile app
- Components can be used in other projects
- Hooks encapsulate reusable behavior
