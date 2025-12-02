import { describe, expect, test } from "bun:test";
import { isHarmonic, findFundamentalFromHarmonics } from "../harmonic-analyzer";

describe("Harmonic Analyzer", () => {
    describe("isHarmonic", () => {
        test("identifies 2nd harmonic (octave)", () => {
            expect(isHarmonic(110, 220)).toBe(true); // A2 -> A3
        });

        test("identifies 3rd harmonic", () => {
            expect(isHarmonic(110, 330)).toBe(true); // A2 -> E4
        });

        test("rejects non-harmonics", () => {
            expect(isHarmonic(110, 115)).toBe(false);
        });
    });

    describe("findFundamentalFromHarmonics", () => {
        test("finds fundamental from a harmonic series", () => {
            // Series for A2 (110Hz): 110, 220, 330, 440
            const candidates = [220, 330, 110, 440];
            const fundamental = findFundamentalFromHarmonics(candidates);
            expect(fundamental).toBe(110);
        });

        test("returns lowest frequency if no clear series", () => {
            const candidates = [440, 445]; // Close but not harmonic
            const fundamental = findFundamentalFromHarmonics(candidates);
            expect(fundamental).toBe(440);
        });

        test("handles empty input", () => {
            expect(findFundamentalFromHarmonics([])).toBe(0);
        });
    });
});
