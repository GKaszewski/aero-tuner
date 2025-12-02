# AeroTuner

An instrument tuner featuring a nostalgic **Frutiger Aero** aesthetic, built with modern web technologies and Clean Architecture.

![Status](https://img.shields.io/badge/Status-Production_Ready-success)
![PWA](https://img.shields.io/badge/PWA-Installable-purple)
![Tests](https://img.shields.io/badge/Tests-Passing-green)
![Design](https://img.shields.io/badge/Design-Frutiger%20Aero-aqua)

## Features

### Precision Tuning
- **FFT-based Pitch Detection**: High-precision frequency analysis using the Web Audio API.
- **Harmonic Product Spectrum (HPS)**: Robust fundamental frequency detection, even for bass instruments.
- **Accurate to ±1 cent**: Professional-grade tuning accuracy (don't quote me on that).
- **Multi-Instrument Support**: Guitar, Ukulele, Bass, and Piano.
- **Alternate Tunings**: Drop D, Open G, DADGAD, and more (Pro Mode).

### Frutiger Aero UI
- **Glossy Aesthetics**: Glassmorphism, vibrant gradients, and detailed reflections.
- **Interactive Gauge**: Smooth, physics-based needle animation.
- **Basic vs. Pro Modes**:
    - **Basic**: Clean interface for quick tuning.
    - **Pro**: Advanced tools including Waveform Display and String Guide.
- **Real-time Waveform**: Visualizes the audio signal in real-time.
- **String Guide**: Visual indicator of the target string.

### Progressive Web App (PWA)
- **Installable**: Add to home screen on iOS, Android, and Desktop.
- **Offline Capable**: Works without an internet connection.
- **App-like Experience**: Fullscreen mode with custom icons.

## Technology Stack

- **Core**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Build**: [Vite](https://vitejs.dev/), [Bun](https://bun.sh/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (with custom Frutiger Aero configuration)
- **Audio**: Web Audio API (`AnalyserNode`, `AudioContext`)
- **State**: React Hooks + LocalStorage persistence
- **Testing**: [Bun Test](https://bun.sh/docs/cli/test)

## Architecture

This project strictly follows **Clean Architecture** principles to ensure maintainability and testability:

- **Domain Layer** (`src/domain`): Pure business logic (Note conversion, Tuning calculations, Harmonic analysis). Zero dependencies.
- **Infrastructure Layer** (`src/infrastructure`): Implementation details (Web Audio API, FFT algorithms).
- **Presentation Layer** (`src/presentation`): UI components and React hooks.

## Quick Start

```bash
# Install dependencies
bun install

# Start development server
bun dev

# Run tests
bun test

# Build for production
bun run build
```

## Testing

The project includes a comprehensive suite of unit tests for the Domain layer.

```bash
bun test
```

Tests cover:
- Frequency ↔ Note conversion
- Cents calculation & Tuning status
- Harmonic analysis & Fundamental frequency detection

## Usage

1.  **Grant Permission**: Allow microphone access when prompted.
2.  **Select Instrument**: Choose Guitar, Bass, Ukulele, or Piano.
3.  **Choose Mode**: Toggle between **Basic** (simple) and **Pro** (advanced) views.
4.  **Tune**: Play a string. The gauge shows if you are sharp (right) or flat (left).
    - **Green**: In tune!
    - **Blue/Red**: Adjust your tuning pegs.

## License

MIT
