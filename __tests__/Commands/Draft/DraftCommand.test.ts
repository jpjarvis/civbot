import {DraftArguments, draftCommand} from "../../../src/CivBot/Commands/Draft/DraftCommand";
import UserData from "../../../src/CivBot/Types/UserData";
import {CivData} from "../../../src/CivBot/CivData";
import {extractErrorAndAssertIsError, extractResultAndAssertIsNotError, generateArray} from "../../TestUtils";
import {CivGroup} from "../../../src/CivBot/Types/CivGroups";

describe('draftCommand', () => {
    
    const emptyUserData: UserData = {
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
        
        const result = await draftCommand(draftArgs, [], emptyUserData, civData);
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

        const result = await draftCommand(draftArgs, ["player1"], emptyUserData, civData);
        const error = extractErrorAndAssertIsError(result.draftResult);

        expect(error).toBe("not-enough-civs");
    });
    
    it('should fall back to default arguments if none are provided in arguments or user data', async () => {
        const result = await draftCommand({}, ["player1"], emptyUserData, civData);
        
        const draft = extractResultAndAssertIsNotError(result.draftResult);
        
        expect(draft).toHaveLength(1);
        expect(draft[0].player).toBe("player1");
        expect(result.civGroupsUsed).toStrictEqual<CivGroup[]>(["civ5-vanilla"]);
    });
    
    it('should fall back to user data arguments if none provided in arguments', async () => {
        const userData : UserData = {
            defaultDraftSettings: {
                numberOfAi: 1,
                civGroups: ["civ6-vanilla"],
                numberOfCivs: 5
            },
            customCivs: []
        }
        
        const result = await draftCommand({}, ["player1"], userData, civData); 
        const draft = extractResultAndAssertIsNotError(result.draftResult);
        
        expect(draft).toHaveLength(2);
        expect(draft[0].civs).toHaveLength(5);
        expect(result.civGroupsUsed).toStrictEqual(["civ6-vanilla"]);
    });
})