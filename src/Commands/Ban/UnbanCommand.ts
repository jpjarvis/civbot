import { loadUserData } from "../../UserDataStore";
import { matchCivs } from "./MatchCivs";
import { ChatInputCommandInteraction } from "discord.js";
import { Civ, renderCiv } from "../../Civs/Civs";
import { MAX_OPTIONS, multipleChoice } from "./MultipleChoice";
import { isBanned, unbanCivs } from "./Ban";

export async function unbanCommand(interaction: ChatInputCommandInteraction) {
    const serverId = interaction.guildId!;

    const searchString = interaction.options.getString("civ")!;
    const userData = await loadUserData(serverId);

    const allMatchedCivs = matchCivs(searchString, userData.game);
    const matchedBannedCivs = allMatchedCivs.filter((x) => isBanned(x, userData));
    const alreadyUnbannedCivs = allMatchedCivs.filter((x) => !isBanned(x, userData));

    if (matchedBannedCivs.length === 0) {
        if (alreadyUnbannedCivs.length == 1) {
            await interaction.reply(`\`${renderCiv(matchedBannedCivs[0])}\` is not banned, so it cannot be unbanned.`);
            return;
        } else if (alreadyUnbannedCivs.length > 1) {
            await interaction.reply(
                `"${searchString}" matches ${alreadyUnbannedCivs.length} civs, but none of them are banned.`,
            );
            return;
        }
        await interaction.reply(`No civ called "${searchString}" exists in ${userData.game}.`);
        return;
    } else if (matchedBannedCivs.length > MAX_OPTIONS) {
        await interaction.reply(
            `"${searchString}" matches ${matchedBannedCivs.length} banned civs. Please me more specific.`,
        );
        return;
    } else if (matchedBannedCivs.length > 1) {
        const chosenCivs = await multipleChoice(interaction, matchedBannedCivs, renderCiv, {
            question: `"${searchString}" matches ${matchedBannedCivs.length} banned civs. Please click one of the reacts to select which one to unban:`,
            selected: unbanMessage,
            timeout: "Request to unban civ timed out.",
        });

        if (chosenCivs) {
            await unbanCivs(serverId, userData, chosenCivs);
            return;
        }
    }

    await unbanCivs(serverId, userData, matchedBannedCivs);
    await interaction.reply(unbanMessage(matchedBannedCivs));
}

function unbanMessage(unbannedCivs: Civ[]) {
    if (unbannedCivs.length == 1) {
        return `\`${renderCiv(unbannedCivs[0])}\` has been unbanned. It will once again appear in your drafts.`;
    }

    return `The following civs have been unbanned: \`\`\`\n${unbannedCivs.map((x) => renderCiv(x)).join("\n")}\`\`\` They will once again appear in your drafts.`;
}
