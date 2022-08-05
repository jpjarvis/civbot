import { loadUserData, saveUserData } from "../../UserDataStore";

export async function saveProfileCommand(tenantId: string, profileName: string) {
    const userData = await loadUserData(tenantId);

    userData.profiles[profileName] = userData.activeUserSettings;

    await saveUserData(tenantId, userData);
    return `Saved current settings as \`${profileName}\`.`;
}
