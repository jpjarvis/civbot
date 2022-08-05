import { loadUserData, saveUserData } from "../../UserDataStore";

export async function clearCustomCivsCommand(tenantId: string) {
    const userData = await loadUserData(tenantId);
    userData.activeUserSettings.customCivs = [];
    await saveUserData(tenantId, userData);
    return "All custom civs deleted.";
}
