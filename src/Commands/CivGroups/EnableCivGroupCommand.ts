import { CivGroup } from "../../Civs/CivGroups";
import { loadUserData, saveUserData } from "../../UserDataStore";

export async function enableCivGroupCommand(tenantId: string, civGroup: CivGroup): Promise<string> {
    const userData = await loadUserData(tenantId);

    if (!userData.activeUserSettings.defaultDraftSettings.civGroups) {
        userData.activeUserSettings.defaultDraftSettings.civGroups = [];
    }

    if (userData.activeUserSettings.defaultDraftSettings.civGroups.includes(civGroup)) {
        return `\`${civGroup}\` is already being used.`;
    }
    userData.activeUserSettings.defaultDraftSettings.civGroups.push(civGroup);

    await saveUserData(tenantId, userData);
    return `\`${civGroup}\` will now be used in your drafts.`;
}
