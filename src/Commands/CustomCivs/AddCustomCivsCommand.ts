import { loadUserData, saveUserData } from "../../UserDataStore";

export async function addCustomCivsCommand(tenantId: string, civs: string[]): Promise<string> {
    const userData = await loadUserData(tenantId);
    userData.userSettings[userData.game].customCivs = userData.userSettings[userData.game].customCivs.concat(civs);
    await saveUserData(tenantId, userData);
    return `Added ${civs.length} custom civs.`;
}
