import { UserSettings } from "./UserSettings";

export type UserData = {
    activeUserSettings: UserSettings;
    profiles: {
        [name in string]: UserSettings;
    };
};

export function createEmptyUserData(): UserData {
    return {
        activeUserSettings: {
            defaultDraftSettings: {
                civGroups: ["civ5-vanilla"]
            },
            customCivs: [],
            bannedCivs: []
        },
        profiles: {},
    };
}
