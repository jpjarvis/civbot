import {Expansion, displayName} from "../../Civs/Expansions";
import { loadUserData, saveUserData } from "../../UserDataStore";

export async function disableExpansionCommand(tenantId: string, expansion: Expansion): Promise<string> {
    const userData = await loadUserData(tenantId);

    const defaultDraftSettings = userData.userSettings[userData.game].defaultDraftSettings;
    
    if (!defaultDraftSettings.expansions) {
        defaultDraftSettings.expansions = [];
    }

    const toRemoveIndex = defaultDraftSettings.expansions.indexOf(expansion);
    if (!defaultDraftSettings.expansions.includes(expansion)) {
        return `\`${displayName(expansion)}\` is not being used.`;
    }
    defaultDraftSettings.expansions.splice(toRemoveIndex, 1);
    
    userData.userSettings[userData.game].defaultDraftSettings = defaultDraftSettings;
    await saveUserData(tenantId, userData);

    return `\`${displayName(expansion)}\` will no longer be used in your drafts.`;
}
