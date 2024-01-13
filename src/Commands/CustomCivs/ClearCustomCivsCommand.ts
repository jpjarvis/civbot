import { loadUserData, saveUserData } from "../../UserDataStore";

export async function clearCustomCivsCommand(tenantId: string) {
    const userData = await loadUserData(tenantId);
    userData.userSettings[userData.game].customCivs = [];
    await saveUserData(tenantId, userData);
    return "All custom civs deleted.";
}
