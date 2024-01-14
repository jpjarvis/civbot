import { loadUserData, saveUserData } from "../../UserDataStore";
import { civExists } from "./CivExists";

export async function banCommand(tenantId: string, civToBan: string) {
    const userData = await loadUserData(tenantId);
    
    if (!civExists(civToBan, userData.game)) {
        return `No civ called ${civToBan} exists in ${userData.game}.`;
    }
    
    userData.userSettings[userData.game].bannedCivs = userData.userSettings[userData.game].bannedCivs.concat(civToBan);
    await saveUserData(tenantId, userData);
    return `${civToBan} has been banned. It will no longer appear in your drafts.`;
}
