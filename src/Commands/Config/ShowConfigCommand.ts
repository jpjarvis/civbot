import { displayName } from "../../Civs/Expansions";
import { UserData } from "../../UserData/UserData";
import { Civ, renderCiv } from "../../Civs/Civs";
import { ChatInputCommandInteraction } from "discord.js";
import { loadUserData } from "../../UserDataStore";

export async function showConfigCommand(interaction: ChatInputCommandInteraction) {
    const serverId = interaction.guildId!;
    let response = renderConfig(await loadUserData(serverId));
    await interaction.reply(response);
}

function renderConfig(userData: UserData): string {
    const activeSettings = userData.userSettings[userData.game];
    const anyCustomCivs = activeSettings.customCivs.length > 0;
    const anyBannedCivs = activeSettings.bannedCivs.length > 0;

    return `
CivBot is drafting for **${userData.game}**.
*To change this, use \`/switch-game\`.*

Enabled expansions: \`\`\`${activeSettings.defaultDraftSettings?.expansions?.map(displayName).join("\n")}\`\`\`
${anyCustomCivs ? customCivsLine(activeSettings.customCivs) : ""}
${anyBannedCivs ? bannedCivsLine(activeSettings.bannedCivs) : ""}`.trim();
}

function customCivsLine(customCivs: string[]) {
    if (customCivs.length > 20) {
        return `${customCivs.length} custom civs are defined. To see the full list, use \`/custom-civs\`.\n`;
    } else {
        return `Custom civs:\`\`\`${customCivs.sort().join("\n")}\`\`\``;
    }
}

function bannedCivsLine(bannedCivs: Civ[]) {
    return `Banned civs:\`\`\`\n${bannedCivs.sort().map(renderCiv).join("\n")}\`\`\``;
}
