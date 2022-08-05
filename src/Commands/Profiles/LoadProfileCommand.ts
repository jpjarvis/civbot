import { UserDataStore } from "../../UserDataStore/UserDataStore";

export async function loadProfileCommand(userDataStore: UserDataStore, tenantId: string, profileName: string) {
    const userData = await userDataStore.load(tenantId);

    const profileSettings = userData.profiles[profileName];

    if (!profileSettings) {
        return `No profile with the name \`${profileName}\` exists.`;
    }

    userData.activeUserSettings = profileSettings;

    await userDataStore.save(tenantId, userData);
    return `Loaded settings from profile \`${profileName}\`.`;
}
