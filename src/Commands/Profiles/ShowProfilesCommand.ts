import { UserData } from "../../Types/UserData";
import { UserSettings } from "../../Types/UserSettings";

function createProfileString(profileName: string, userSettings: UserSettings) {
    const civGroupsString = userSettings.defaultDraftSettings.civGroups?.map((x) => `\`${x}\``).join(",");
    const customCivsString =
        userSettings.customCivs.length > 0 ? ` and ${userSettings.customCivs.length} custom civs` : "";
    return `\`${profileName}\`: ${civGroupsString}${customCivsString}`;
}

export async function showProfilesCommand(userData: UserData) {
    const profileNames = Object.keys(userData.profiles);

    return profileNames.length > 0
        ? profileNames.map((x) => createProfileString(x, userData.profiles[x])).join("\n")
        : "You don't have any saved profiles.";
}
