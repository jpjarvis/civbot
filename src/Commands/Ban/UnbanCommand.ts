import { loadUserData, saveUserData } from "../../UserDataStore";
import { civExists } from "./CivExists";

export async function unbanCommand(tenantId: string, civToUnban: string) {
    if (!civExists(civToUnban)) {
        return `No civ called ${civToUnban} exists.`;
    }

    const userData = await loadUserData(tenantId);

    if (!userData.userSettings[userData.game].bannedCivs.includes(civToUnban)) {
        return `${civToUnban} is not banned, so it cannot be unbanned.`;
    }
    const toRemoveIndex = userData.userSettings[userData.game].bannedCivs.indexOf(civToUnban);
    userData.userSettings[userData.game].bannedCivs.splice(toRemoveIndex, 1);

    await saveUserData(tenantId, userData);
    return `${civToUnban} has been unbanned. It will appear in your drafts once again.`;
}
