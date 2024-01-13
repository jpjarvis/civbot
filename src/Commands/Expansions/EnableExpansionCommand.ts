import {Expansion, displayName} from "../../Civs/Expansions";
import { loadUserData, saveUserData } from "../../UserDataStore";
import {User} from "discord.js";

export async function enableExpansionCommand(tenantId: string, expansion: Expansion): Promise<string> {
    const userData = await loadUserData(tenantId);

    const defaultDraftSettings = userData.userSettings[userData.game].defaultDraftSettings;
    
    if (!defaultDraftSettings.expansions) {
        defaultDraftSettings.expansions = [];
    }

    if (defaultDraftSettings.expansions.includes(expansion)) {
        return `\`${displayName(expansion)}\` is already being used.`;
    }
    defaultDraftSettings.expansions.push(expansion);

    userData.userSettings[userData.game].defaultDraftSettings = defaultDraftSettings;
    
    await saveUserData(tenantId, userData);
    return `\`${displayName(expansion)}\` will now be used in your drafts.`;
}
