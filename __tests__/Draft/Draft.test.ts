import {generateArray} from "../TestUtils";
import {draft} from "../../src/Draft/DraftExecutor";

describe('draft', () => {
    
    const civs = generateArray(20);
    
    it('should succeed under normal circumstances', async () => {
        const draftResultOrError = await draft(generateArray(3), 3, civs)
        expect(draftResultOrError.isError).toBe(false);
    })

    it('should draft the right number of civs for all players',async () => {
        const players = generateArray(3)
        const draftResultOrError = await draft(players, 3, civs);

        expect(draftResultOrError.isError).toBe(false);
        
        if (draftResultOrError.isError) {
            return
        }
        
        for (const player of players) {
            expect(draftResultOrError.result[player]).toHaveLength(3)
        }
    })
    
    it('should succeed if civsPerPlayer is 0', async () => {
        const draftResult = await draft(generateArray(3), 0, civs);
        expect(draftResult.isError).toBe(false);
    })
    
    it('should fail if there are no players', async () => {
        const draftResult = await draft([], 3, civs);
        
        expect(draftResult.isError).toBe(true)
        if (!draftResult.isError) {
            return
        }
        expect(draftResult.error).toBe('no-players')
    })
    
    it('should fail if there are not enough civs for the players', async () => {
        const draftResult = await draft(generateArray(10), 100, civs);

        expect(draftResult.isError).toBe(true)
        if (!draftResult.isError) {
            return
        }
        expect(draftResult.error).toBe('not-enough-civs')
    })
})