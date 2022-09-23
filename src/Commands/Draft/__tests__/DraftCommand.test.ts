import { DraftArguments, draftCommand } from "../DraftCommand";
import { UserSettings } from "../../../UserData/UserSettings";
import Messages from "../../../Messages";

function extractDraftMessageLines(draftMessage: string) {
    const lines = draftMessage.split("\n").filter((x) => x !== "");

    return {
        civGroupsLine: lines[0],
        draftLines: lines
            .splice(1)
            .map((x) => x.replace(/`/g, ""))
            .map((x) => ({
                fullText: x,
                civsCount: x.split("/").length,
            })),
    };
}

describe("draftCommand", () => {
    const emptyUserSettings: UserSettings = {
        defaultDraftSettings: {},
        customCivs: [],
        bannedCivs: [],
    };

    it("should give an error if there are no players", () => {
        const draftArgs: DraftArguments = {
            numberOfAi: 0,
            numberOfCivs: 3,
            civGroups: ["civ5-vanilla"],
        };

        const result = draftCommand(draftArgs, [], emptyUserSettings);

        expect(result.trim()).toBe(Messages.NoPlayers);
    });

    it("should give an error if there are not enough civs for the players", () => {
        const draftArgs: DraftArguments = {
            numberOfAi: 0,
            numberOfCivs: 100,
            civGroups: ["civ5-vanilla"],
        };

        const result = draftCommand(draftArgs, ["player1"], emptyUserSettings);

        expect(result.trim()).toBe(Messages.NotEnoughCivs);
    });

    it("should fall back to default arguments if none are provided in arguments or user data", () => {
        const result = draftCommand({}, ["player1"], emptyUserSettings);

        const { civGroupsLine, draftLines } = extractDraftMessageLines(result);

        expect(draftLines).toHaveLength(1);
        expect(draftLines[0].fullText).toStartWith("player1");
        expect(civGroupsLine).toContain("civ5-vanilla");
    });

    it("should fall back to user data arguments if none provided in arguments", () => {
        const userSettings: UserSettings = {
            defaultDraftSettings: {
                numberOfAi: 1,
                civGroups: ["civ6-vanilla"],
                numberOfCivs: 5,
            },
            customCivs: [],
            bannedCivs: [],
        };

        const result = draftCommand({}, ["player1"], userSettings);
        const { civGroupsLine, draftLines } = extractDraftMessageLines(result);

        expect(draftLines).toHaveLength(2);
        expect(draftLines[0].civsCount).toBe(5);
        expect(civGroupsLine).toStrictEqual("Drafting for `civ6-vanilla`");
    });
});
