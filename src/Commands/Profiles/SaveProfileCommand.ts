import {UserDataStore} from "../../UserDataStore/UserDataStore";

export async function saveProfileCommand(userDataStore: UserDataStore, tenantId: string, profileName: string) {
    const userData = await userDataStore.load(tenantId);

    userData.profiles[profileName] = userData.activeUserSettings;

    await userDataStore.save(tenantId, userData);
    return `Saved current settings as \`${profileName}\`.`;
}