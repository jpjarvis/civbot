import {DraftArguments, draftCommand} from "../../../src/CivBot/Commands/Draft/DraftCommand";
import UserData from "../../../src/CivBot/Types/UserData";
import {CivData} from "../../../src/CivBot/CivData";
import {extractErrorAndAssertIsError, extractResultAndAssertIsNotError, generateArray} from "../../TestUtils";

describe('draftCommand', () => {
    
    const userData: UserData = {
        defaultDraftSettings: {},
        customCivs: []
    }
    
    const civData: CivData = {
        civs: {
            "civ5-vanilla": generateArray(10),
            "lekmod": generateArray(10),
            "civ6-vanilla": generateArray(10),
            "civ6-rnf": generateArray(10),
            "civ6-gs": generateArray(10),
            "civ6-extra": generateArray(10),
            "civ6-frontier": generateArray(10)
        }
    }

    it('should give a no-players error if there are no players', async () => {
        const draftArgs: DraftArguments = {
            numberOfAi: 0,
            numberOfCivs: 3,
            civGroups: ['civ5-vanilla']
        }
        
        const result = await draftCommand(draftArgs, [], userData, civData);
        expect(result.draftResult.isError).toBe(true)
        if (!result.draftResult.isError) {
            return;
        }
        
        expect(result.draftResult.error).toBe("no-players");
    });

    it('should give a not-enough-civs error if there are not enough civs for the players', async () => {
        const draftArgs: DraftArguments = {
            numberOfAi: 0,
            numberOfCivs: 100,
            civGroups: ['civ5-vanilla']
        }

        const result = await draftCommand(draftArgs, ["player1"], userData, civData);
        const error = extractErrorAndAssertIsError(result.draftResult);

        expect(error).toBe("not-enough-civs");
    });
})