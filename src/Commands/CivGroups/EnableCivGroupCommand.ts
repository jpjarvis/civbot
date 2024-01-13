import { CivGroup } from "../../Civs/CivGroups";
import { loadUserData, saveUserData } from "../../UserDataStore";
import {User} from "discord.js";

export async function enableCivGroupCommand(tenantId: string, civGroup: CivGroup): Promise<string> {
    const userData = await loadUserData(tenantId);

    const defaultDraftSettings = userData.userSettings[userData.game].defaultDraftSettings;
    
    if (!defaultDraftSettings.civGroups) {
        defaultDraftSettings.civGroups = [];
    }

    if (defaultDraftSettings.civGroups.includes(civGroup)) {
        return `\`${civGroup}\` is already being used.`;
    }
    defaultDraftSettings.civGroups.push(civGroup);

    userData.userSettings[userData.game].defaultDraftSettings = defaultDraftSettings;
    
    await saveUserData(tenantId, userData);
    return `\`${civGroup}\` will now be used in your drafts.`;
}
