import { loadUserData } from "../../UserDataStore";
import { ChatInputCommandInteraction } from "discord.js";
import { Civ, renderCiv } from "../../Civs/Civs";
import { unbanCivs } from "./Ban";

export async function unbanCommand(interaction: ChatInputCommandInteraction) {
    const serverId = interaction.guildId!;

    const searchString = interaction.options.getString("civ")!.toLowerCase();
    const userData = await loadUserData(serverId);

    const allMatchedCivs = userData.userSettings[userData.game].bannedCivs.filter((civ) =>
        renderCiv(civ).toLowerCase().includes(searchString),
    );

    if (allMatchedCivs.length == 0) {
        await interaction.reply(`"${searchString}" didn't match any banned civs.`);
        return;
    }
    if (allMatchedCivs.length > 1) {
        await interaction.reply(
            `"${searchString}" matches ${allMatchedCivs.length} civs currently banned. Use the autocomplete to find the specific leader/civ you want to unban.`,
        );
        return;
    } else {
        const chosenCiv = allMatchedCivs[0];
        await unbanCivs(serverId, userData, [chosenCiv]);
        await interaction.reply(unbanMessage(chosenCiv));
        return;
    }
}

function unbanMessage(unbannedCiv: Civ) {
    return `\`${renderCiv(unbannedCiv)}\` has been unbanned. It will once again appear in your drafts.`;
}
