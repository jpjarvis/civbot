import { loadUserData, saveUserData } from "../../UserDataStore";

export async function addCustomCivsCommand(tenantId: string, civs: string[]): Promise<string> {
    const userData = await loadUserData(tenantId);
    userData.activeUserSettings.customCivs = userData.activeUserSettings.customCivs.concat(civs);
    await saveUserData(tenantId, userData);
    return `Added ${civs.length} custom civs.`;
}
