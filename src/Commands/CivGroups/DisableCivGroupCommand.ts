import { CivGroup } from "../../Civs/CivGroups";
import { loadUserData, saveUserData } from "../../UserDataStore";

export async function disableCivGroupCommand(tenantId: string, civGroup: CivGroup): Promise<string> {
    const userData = await loadUserData(tenantId);

    const defaultDraftSettings = userData.userSettings[userData.game].defaultDraftSettings;
    
    if (!defaultDraftSettings.civGroups) {
        defaultDraftSettings.civGroups = [];
    }

    const toRemoveIndex = defaultDraftSettings.civGroups.indexOf(civGroup);
    if (!defaultDraftSettings.civGroups.includes(civGroup)) {
        return `\`${civGroup}\` is not being used.`;
    }
    defaultDraftSettings.civGroups.splice(toRemoveIndex, 1);
    
    userData.userSettings[userData.game].defaultDraftSettings = defaultDraftSettings;
    await saveUserData(tenantId, userData);

    return `\`${civGroup}\` will no longer be used in your drafts.`;
}
