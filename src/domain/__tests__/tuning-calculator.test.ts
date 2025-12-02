import { describe, expect, test } from "bun:test";
import { calculateTuningState } from "../tuning-calculator";
import { frequencyToCents } from "../note-converter";

describe("Tuning Calculator", () => {
    describe("frequencyToCents", () => {
        test("returns 0 for exact match", () => {
            expect(frequencyToCents(440, 440)).toBe(0);
        });

        test("returns positive for sharp", () => {
            // A bit sharp
            const cents = frequencyToCents(442, 440);
            expect(cents).toBeGreaterThan(0);
            expect(cents).toBeCloseTo(7.85, 1);
        });

        test("returns negative for flat", () => {
            // A bit flat
            const cents = frequencyToCents(438, 440);
            expect(cents).toBeLessThan(0);
            expect(cents).toBeCloseTo(-7.89, 1);
        });
    });

    describe("calculateTuningState", () => {
        test("returns 'in-tune' for < 5 cents", () => {
            const state = calculateTuningState(440.5, 440);
            expect(state.status).toBe("in-tune");
        });

        test("returns 'sharp' for > 5 cents", () => {
            // 445Hz vs 440Hz is ~19 cents sharp
            const state = calculateTuningState(445, 440);
            expect(state.status).toBe("sharp");
        });

        test("returns 'flat' for < -5 cents", () => {
            // 435Hz vs 440Hz is ~-19 cents flat
            const state = calculateTuningState(435, 440);
            expect(state.status).toBe("flat");
        });
    });
});
