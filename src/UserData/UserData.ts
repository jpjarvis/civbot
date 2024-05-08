import { UserSettings } from "./UserSettings";
import { CivGame } from "../Civs/CivGames";
import { FeatureFlag } from "./FeatureFlags";

export type UserData = {
    game: CivGame;
    userSettings: { [game in CivGame]: UserSettings };
    featureFlags: FeatureFlag[];
};

export function createDefaultUserData(): UserData {
    return {
        game: "Civ 5",
        userSettings: {
            "Civ 5": {
                defaultDraftSettings: {
                    expansions: ["civ5-vanilla"],
                },
                customCivs: [],
                bannedCivs: [],
            },
            "Civ 6": {
                defaultDraftSettings: {
                    expansions: [
                        "civ6-vanilla",
                        "civ6-rnf",
                        "civ6-gs",
                        "civ6-extra",
                        "civ6-frontier",
                        "civ6-leaderpass",
                        "civ6-personas",
                    ],
                },
                customCivs: [],
                bannedCivs: [],
            },
        },
        featureFlags: [],
    };
}
