import {UserSettings} from "./UserSettings";
import {CivGame} from "../Civs/CivGames";

export type UserData = {
    game: CivGame
    userSettings: { [game in CivGame]: UserSettings };
    profiles: {
        [name in string]: UserSettings;
    };
};

export function createDefaultUserData(): UserData {
    return {
        game: "Civ 5",
        userSettings: {
            "Civ 5": {
                defaultDraftSettings: {
                    civGroups: ["civ5-vanilla"]
                },
                customCivs: [],
                bannedCivs: []
            },
            "Civ 6": {
                defaultDraftSettings: {
                    civGroups: ["civ6-vanilla", "civ6-rnf", "civ6-gs", "civ6-extra", "civ6-frontier", "civ6-leaderpass", "civ6-personas"]
                },
                customCivs: [],
                bannedCivs: []
            }
        },
        profiles: {
            "civ5": {
                defaultDraftSettings: {
                    civGroups: ["civ5-vanilla"]
                },
                customCivs: [],
                bannedCivs: []
            },
            "civ5-lekmod": {
                defaultDraftSettings: {
                    civGroups: ["civ5-vanilla", "lekmod"]
                },
                customCivs: [],
                bannedCivs: []
            },
            "civ6": {
                defaultDraftSettings: {
                    civGroups: ["civ6-vanilla", "civ6-rnf", "civ6-gs", "civ6-extra", "civ6-frontier", "civ6-leaderpass", "civ6-personas"]
                },
                customCivs: [],
                bannedCivs: []
            }
        },
    };
}
