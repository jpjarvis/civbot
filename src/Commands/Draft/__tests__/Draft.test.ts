import { extractErrorAndAssertIsError, extractResultAndAssertIsNotError } from "../../../TestUtils";
import { draft } from "../Draft";
import { DraftedCiv } from "../DraftTypes";

describe("draft", () => {
    const civs: DraftedCiv[] = generateArray(20).map(toDraftedCiv);

    it("should succeed under normal circumstances", async () => {
        const draftResultOrError = draft(generateArray(3), 3, civs);
        expect(draftResultOrError.isError).toBe(false);
    });

    it("should draft the right number of civs for all players", async () => {
        const players = generateArray(3);
        const draftResultOrError = draft(players, 3, civs);

        const draftResult = extractResultAndAssertIsNotError(draftResultOrError);

        for (const draftEntry of draftResult) {
            expect(draftEntry.civs).toHaveLength(3);
        }
    });

    it("should succeed if civsPerPlayer is 0", async () => {
        const draftResult = draft(generateArray(3), 0, civs);
        expect(draftResult.isError).toBe(false);
    });

    it("should fail if there are no players", async () => {
        const draftResult = draft([], 3, civs);

        const error = extractErrorAndAssertIsError(draftResult);
        expect(error).toBe("no-players");
    });

    it("should fail if there are not enough civs for the players", async () => {
        const draftResult = draft(generateArray(10), 100, civs);

        const error = extractErrorAndAssertIsError(draftResult);
        expect(error).toBe("not-enough-civs");
    });
});

function generateArray(count: number): string[] {
    return Array.from(Array(count)).map((_, i) => `item${i}`);
}

function toDraftedCiv(name: string): DraftedCiv { 
    return {custom: true, name: name}
}