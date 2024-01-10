import { UserSettings } from "./UserSettings";

export type UserData = {
    activeUserSettings: UserSettings;
    profiles: {
        [name in string]: UserSettings;
    };
};

export function createDefaultUserData(): UserData {
    return {
        activeUserSettings: {
            defaultDraftSettings: {
                civGroups: ["civ5-vanilla"]
            },
            customCivs: [],
            bannedCivs: []
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
