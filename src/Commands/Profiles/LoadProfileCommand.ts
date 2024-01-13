import { loadUserData, saveUserData } from "../../UserDataStore";

export async function loadProfileCommand(tenantId: string, profileName: string) {
    const userData = await loadUserData(tenantId);

    const profileSettings = userData.profiles[profileName];

    if (!profileSettings) {
        return `No profile with the name \`${profileName}\` exists.`;
    }

    userData.userSettings[userData.game] = profileSettings;

    await saveUserData(tenantId, userData);
    return `Loaded settings from profile \`${profileName}\`.`;
}
