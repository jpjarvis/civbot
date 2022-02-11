﻿import {DraftExecutor} from "../../src/Draft/DraftExecutor";
import {generateArray} from "../TestUtils";
import {createMockCivsRepository} from "../Mocks";

describe('DraftExecutor', () => {
    const draftExecutor = new DraftExecutor(createMockCivsRepository(10))
    
    it('should succeed under normal circumstances', async () => {
        const draftResult = await draftExecutor.executeDraft(generateArray(3), 3, [], "")
        expect(draftResult.success)
    })

    it('should draft the right number of civs for all players',async () => {
        const players = generateArray(3)
        const draft = await draftExecutor.executeDraft(players, 3, [], "");

        expect(draft.success)
        
        if (!draft.success) {
            return
        }
        
        for (const player of players) {
            expect(draft.draft[player]).toHaveLength(3)
        }
    })
    
    it('should succeed if civsPerPlayer is 0', async () => {
        const draftResult = await draftExecutor.executeDraft(generateArray(3), 0, [], "")
        expect(draftResult.success)
    })
    
    it('should fail if there are no players', async () => {
        const draftResult = await draftExecutor.executeDraft([], 3, [], "")
        
        expect(draftResult.success).toBe(false)
        if (draftResult.success) {
            return
        }
        expect(draftResult.error).toBe('no-players')
    })
    
    it('should fail if there are not enough civs for the players', async () => {
        const draftResult = await draftExecutor.executeDraft(generateArray(10), 100, [], "")

        expect(draftResult.success).toBe(false)
        if (draftResult.success) {
            return
        }
        expect(draftResult.error).toBe('not-enough-civs')
    })
})