import { CivGroup } from "../../Types/CivGroups";
import { loadUserData, saveUserData } from "../../UserDataStore";

export async function disableCivGroupCommand(tenantId: string, civGroup: CivGroup): Promise<string> {
    const userData = await loadUserData(tenantId);

    if (!userData.activeUserSettings.defaultDraftSettings.civGroups) {
        userData.activeUserSettings.defaultDraftSettings.civGroups = [];
    }

    const toRemoveIndex = userData.activeUserSettings.defaultDraftSettings.civGroups.indexOf(civGroup);
    if (!userData.activeUserSettings.defaultDraftSettings.civGroups.includes(civGroup)) {
        return `\`${civGroup}\` is not being used.`;
    }
    userData.activeUserSettings.defaultDraftSettings.civGroups.splice(toRemoveIndex, 1);
    await saveUserData(tenantId, userData);

    return `\`${civGroup}\` will no longer be used in your drafts.`;
}
