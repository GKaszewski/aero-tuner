import { describe, expect, test } from "bun:test";
import { frequencyToNote, midiNumberToFrequency } from "../note-converter";

describe("Note Converter", () => {
    describe("frequencyToNote", () => {
        test("correctly identifies A4 (440Hz)", () => {
            const result = frequencyToNote(440);
            expect(result).not.toBeNull();
            if (result) {
                expect(result.name).toBe("A");
                expect(result.octave).toBe(4);
                expect(result.frequency).toBe(440);
            }
        });

        test("correctly identifies C4 (Middle C)", () => {
            const result = frequencyToNote(261.63);
            expect(result).not.toBeNull();
            if (result) {
                expect(result.name).toBe("C");
                expect(result.octave).toBe(4);
            }
        });

        test("correctly identifies E2 (Low E on Guitar)", () => {
            const result = frequencyToNote(82.41);
            expect(result).not.toBeNull();
            if (result) {
                expect(result.name).toBe("E");
                expect(result.octave).toBe(2);
            }
        });

        test("handles slight deviations", () => {
            // 442Hz is still A4, just sharp
            const result = frequencyToNote(442);
            expect(result).not.toBeNull();
            if (result) {
                expect(result.name).toBe("A");
                expect(result.octave).toBe(4);
            }
        });
    });

    describe("midiNumberToFrequency", () => {
        test("returns correct frequency for A4 (MIDI 69)", () => {
            const freq = midiNumberToFrequency(69);
            expect(freq).toBeCloseTo(440, 1);
        });

        test("returns correct frequency for C4 (MIDI 60)", () => {
            const freq = midiNumberToFrequency(60);
            expect(freq).toBeCloseTo(261.63, 1);
        });
    });
});
