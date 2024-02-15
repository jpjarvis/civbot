import { Expansion, displayName, stringToExpansion } from "../../Civs/Expansions";
import { loadUserData, saveUserData } from "../../UserDataStore";
import { ChatInputCommandInteraction } from "discord.js";

export async function disableExpansionCommand(interaction: ChatInputCommandInteraction) {
    const serverId = interaction.guildId!;
    const expansion = stringToExpansion(interaction.options.getString("expansion")!)!;

    const message = await disableExpansion(serverId, expansion);
    await interaction.reply(message);
}

async function disableExpansion(tenantId: string, expansion: Expansion): Promise<string> {
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
