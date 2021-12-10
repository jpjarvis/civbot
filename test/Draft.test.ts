import {DraftArguments, DraftExecutor} from "../src/Draft";
import {CivsRepository} from "../src/CivsRepository/interface";
import {generateArray} from "./TestUtils";

function createMockCivsRepository(numberOfCivs: number): CivsRepository {
    return {
        getCivs: async (civGroups, serverId) => generateArray(numberOfCivs)
    }
}


describe('DraftExecutor', () => {
    const draftExecutor = new DraftExecutor(createMockCivsRepository(10))
    
    it('should succeed under normal circumstances', async () => {
        const draftArgs: DraftArguments = {
            numberOfAi: 3,
            numberOfCivs: 3,
            noVoice: true,
            civGroups: ["civ5-vanilla"]
        };

        const draftResult = await draftExecutor.executeDraft(draftArgs, undefined, "")
        expect(draftResult.success)
    })

    it('should succeed if numberOfCivs is 0', async () => {
        const draftArgs: DraftArguments = {
            numberOfAi: 3,
            numberOfCivs: 0,
            noVoice: true,
            civGroups: ["civ5-vanilla"]
        };

        const draftResult = await draftExecutor.executeDraft(draftArgs, undefined, "")
        expect(draftResult.success)
    })
    
    it('should fail if there are no voice players or ai players', async () => {
        const draftArgs: DraftArguments = {
            numberOfAi: 0,
            numberOfCivs: 3,
            noVoice: true,
            civGroups: ["civ5-vanilla"]
        }

        const draftResult = await draftExecutor.executeDraft(draftArgs, undefined, "")
        
        expect(draftResult.success).toBe(false)
        if (draftResult.success) {
            return
        }
        expect(draftResult.error).toBe('no-players')
    })
    
    it('should fail if there are not enough civs for the players', async () => {
        const draftArgs: DraftArguments = {
            numberOfAi: 10,
            numberOfCivs: 100,
            noVoice: true,
            civGroups: ["civ5-vanilla"]
        }
        
        const draftResult = await draftExecutor.executeDraft(draftArgs, undefined, "")

        expect(draftResult.success).toBe(false)
        if (draftResult.success) {
            return
        }
        expect(draftResult.error).toBe('not-enough-civs')
    })
})