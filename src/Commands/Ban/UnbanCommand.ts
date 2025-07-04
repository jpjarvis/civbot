import { loadUserData } from "../../UserDataStore";
import { ChatInputCommandInteraction } from "discord.js";
import {Civ, CivId, getCiv, renderCiv} from "../../Civs/Civs";
import { unbanCivs } from "./Ban";
import {CivGame} from "../../Civs/CivGames";
import {civBotReply} from "../../Discord/CivBotReply";

export async function unbanCommand(interaction: ChatInputCommandInteraction) {
    const serverId = interaction.guildId!;

    const searchString = interaction.options.getString("civ")!.toLowerCase();
    const userData = await loadUserData(serverId);

    const allMatchedCivs = userData.userSettings[userData.game].bannedCivs.filter((civId) =>
        renderCiv(getCiv(civId), userData.game).toLowerCase().includes(searchString),
    );

    if (allMatchedCivs.length == 0) {
        await civBotReply(interaction, `"${searchString}" didn't match any banned civs.`);
        return;
    }
    if (allMatchedCivs.length > 1) {
        await civBotReply(interaction, 
            `"${searchString}" matches ${allMatchedCivs.length} civs currently banned. Use the autocomplete to find the specific leader/civ you want to unban.`,
        );
        return;
    } else {
        const chosenCiv = allMatchedCivs[0];
        await unbanCivs(serverId, userData, [chosenCiv]);
        await civBotReply(interaction, unbanMessage(chosenCiv, userData.game));
        return;
    }
}

function unbanMessage(unbannedCiv: CivId, civGame: CivGame) {
    return `\`${renderCiv(getCiv(unbannedCiv), civGame)}\` has been unbanned. It will once again appear in your drafts.`;
}
