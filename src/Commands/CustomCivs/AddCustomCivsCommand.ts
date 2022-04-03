import {UserDataStore} from "../../UserDataStore/UserDataStore";

export async function addCustomCivsCommand(userDataStore: UserDataStore, tenantId: string, civs: string[]): Promise<string> {
    const userData = await userDataStore.load(tenantId);
    userData.activeUserSettings.customCivs = userData.activeUserSettings.customCivs.concat(civs);
    await userDataStore.save(tenantId, userData);
    return `Added ${civs.length} custom civs.`;
}