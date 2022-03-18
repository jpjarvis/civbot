import {extractErrorAndAssertIsError, extractResultAndAssertIsNotError, generateArray} from "../../TestUtils";
import {draft} from "../../../src/CivBot/Commands/Draft/Draft";

describe('draft', () => {
    
    const civs = generateArray(20);
    
    it('should succeed under normal circumstances', async () => {
        const draftResultOrError = draft(generateArray(3), 3, civs)
        expect(draftResultOrError.isError).toBe(false);
    })

    it('should draft the right number of civs for all players',async () => {
        const players = generateArray(3)
        const draftResultOrError = draft(players, 3, civs);

        const draftResult = extractResultAndAssertIsNotError(draftResultOrError);
        
        for (const draftEntry of draftResult) {
            expect(draftEntry.civs).toHaveLength(3)
        }
    })
    
    it('should succeed if civsPerPlayer is 0', async () => {
        const draftResult = draft(generateArray(3), 0, civs);
        expect(draftResult.isError).toBe(false);
    })
    
    it('should fail if there are no players', async () => {
        const draftResult = draft([], 3, civs);
        
        const error = extractErrorAndAssertIsError(draftResult);
        expect(error).toBe('no-players')
    })
    
    it('should fail if there are not enough civs for the players', async () => {
        const draftResult = draft(generateArray(10), 100, civs);

        const error = extractErrorAndAssertIsError(draftResult);
        expect(error).toBe('not-enough-civs')
    })
})