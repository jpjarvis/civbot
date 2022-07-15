﻿import {DraftArguments, draftCommand} from "../DraftCommand";
import {
    extractErrorAndAssertIsError,
    extractResultAndAssertIsNotError
} from "../../../TestUtils";
import {CivGroup} from "../../../Types/CivGroups";
import UserSettings from "../../../Types/UserSettings";

describe('draftCommand', () => {

    const emptyUserSettings: UserSettings = {
        defaultDraftSettings: {},
        customCivs: []
    }

    it('should give a no-players error if there are no players', () => {
        const draftArgs: DraftArguments = {
            numberOfAi: 0,
            numberOfCivs: 3,
            civGroups: ['civ5-vanilla']
        }

        const result = draftCommand(draftArgs, [], emptyUserSettings);
        expect(result.draftResult.isError).toBe(true)
        if (!result.draftResult.isError) {
            return;
        }

        expect(result.draftResult.error).toBe("no-players");
    });

    it('should give a not-enough-civs error if there are not enough civs for the players', () => {
        const draftArgs: DraftArguments = {
            numberOfAi: 0,
            numberOfCivs: 100,
            civGroups: ['civ5-vanilla']
        }

        const result = draftCommand(draftArgs, ["player1"], emptyUserSettings);
        const error = extractErrorAndAssertIsError(result.draftResult);

        expect(error).toBe("not-enough-civs");
    });

    it('should fall back to default arguments if none are provided in arguments or user data', () => {
        const result = draftCommand({}, ["player1"], emptyUserSettings);

        const draft = extractResultAndAssertIsNotError(result.draftResult);

        expect(draft).toHaveLength(1);
        expect(draft[0].player).toBe("player1");
        expect(result.civGroupsUsed).toStrictEqual<CivGroup[]>(["civ5-vanilla"]);
    });

    it('should fall back to user data arguments if none provided in arguments', () => {
        const userSettings: UserSettings = {
            defaultDraftSettings: {
                numberOfAi: 1,
                civGroups: ["civ6-vanilla"],
                numberOfCivs: 5
            },
            customCivs: []
        }

        const result = draftCommand({}, ["player1"], userSettings);
        const draft = extractResultAndAssertIsNotError(result.draftResult);

        expect(draft).toHaveLength(2);
        expect(draft[0].civs).toHaveLength(5);
        expect(result.civGroupsUsed).toStrictEqual(["civ6-vanilla"]);
    });

    it('should only include civs from specified civ groups', () => {
        const result = draftCommand({civGroups: ["lekmod"]}, ["player1"], emptyUserSettings);
        const draft = extractResultAndAssertIsNotError(result.draftResult);

        expect(draft.every(de => de.civs.every(civ => civ.includes("lekmod"))));
    })
})