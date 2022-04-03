import {UserDataStore} from "../../UserDataStore/UserDataStore";

export async function clearCustomCivsCommand(userDataStore: UserDataStore, tenantId: string) {
    const userData = await userDataStore.load(tenantId);
    userData.activeUserSettings.customCivs = [];
    await userDataStore.save(tenantId, userData);
    return "All custom civs deleted.";
}