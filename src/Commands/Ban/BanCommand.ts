import { loadUserData } from "../../UserDataStore";
import { matchCivs } from "./MatchCivs";
import { Civ, renderCiv } from "../../Civs/Civs";
import { ChatInputCommandInteraction } from "discord.js";
import { MAX_OPTIONS, multipleChoice } from "./MultipleChoice";
import { banCivs, isBanned } from "./Ban";

export async function banCommand(interaction: ChatInputCommandInteraction) {
    const serverId = interaction.guildId!;

    const searchString = interaction.options.getString("civ")!;
    const userData = await loadUserData(serverId);

    const allMatchedCivs = matchCivs(searchString, userData.game);
    const alreadyBannedCivs = allMatchedCivs.filter((x) => isBanned(x, userData));
    const availableMatchedCivs = allMatchedCivs.filter((x) => !isBanned(x, userData));

    if (availableMatchedCivs.length === 0) {
        if (alreadyBannedCivs.length == 1) {
            await interaction.reply(`\`${renderCiv(alreadyBannedCivs[0])}\` is already banned.`);
        } else if (alreadyBannedCivs.length > 1) {
            await interaction.reply(
                `"${searchString}" matches ${alreadyBannedCivs.length} civs, but they are all already banned.`,
            );
        }
        await interaction.reply(`No civ called "${searchString}" exists in ${userData.game}.`);
        return;
    } else if (availableMatchedCivs.length > MAX_OPTIONS) {
        await interaction.reply(
            `"${searchString}" matches ${availableMatchedCivs.length} civs that aren't already banned. Please me more specific.`,
        );
        return;
    } else if (availableMatchedCivs.length > 1) {
        const chosenCivs = await multipleChoice(interaction, availableMatchedCivs, renderCiv, {
            question: `"${searchString}" matches ${availableMatchedCivs.length} civs that aren't already banned. Please click one of the reacts to select which one to ban:`,
            selected: banMessage,
            timeout: "Request to ban civ timed out.",
        });

        if (chosenCivs) {
            await banCivs(serverId, userData, chosenCivs);
            return;
        }
    }

    await banCivs(serverId, userData, availableMatchedCivs);
    await interaction.reply(banMessage(availableMatchedCivs));
}

function banMessage(bannedCivs: Civ[]) {
    if (bannedCivs.length == 1) {
        return `\`${renderCiv(bannedCivs[0])}\` has been banned. It will no longer appear in your drafts.`;
    }

    return `The following civs have been banned: \`\`\`\n${bannedCivs.map((x) => renderCiv(x)).join("\n")}\`\`\` They will no longer appear in your drafts.`;
}
