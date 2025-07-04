import { Expansion, displayName, stringToExpansion } from "../../Civs/Expansions";
import { loadUserData, saveUserData } from "../../UserDataStore";
import { ChatInputCommandInteraction } from "discord.js";
import {civBotReply} from "../../Discord/CivBotReply";

export async function enableExpansionCommand(interaction: ChatInputCommandInteraction) {
    const serverId = interaction.guildId!;
    const expansion = stringToExpansion(interaction.options.getString("expansion")!)!;

    const message = await enableExpansion(serverId, expansion);
    await civBotReply(interaction, message);
}

async function enableExpansion(tenantId: string, expansion: Expansion): Promise<string> {
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
