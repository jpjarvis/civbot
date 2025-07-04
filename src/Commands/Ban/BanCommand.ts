import { loadUserData } from "../../UserDataStore";
import {Civ, CivId, getCiv, renderCiv} from "../../Civs/Civs";
import { ChatInputCommandInteraction } from "discord.js";
import { banCivs } from "./Ban";
import { selectCivIds } from "../../Civs/SelectCivIds";
import {CivGame} from "../../Civs/CivGames";

export async function banCommand(interaction: ChatInputCommandInteraction) {
    const serverId = interaction.guildId!;

    const searchString = interaction.options.getString("civ")!.toLowerCase();
    const userData = await loadUserData(serverId);
    const userSettings = userData.userSettings[userData.game];

    const allMatchedCivs = selectCivIds(
        userSettings.defaultDraftSettings.expansions ?? [],
        userSettings.bannedCivs,
    ).filter((civ) => renderCiv(getCiv(civ), userData.game).toLowerCase().includes(searchString));

    if (allMatchedCivs.length == 0) {
        await interaction.reply(`"${searchString}" didn't match any civs currently included in your draft.`);
        return;
    }
    if (allMatchedCivs.length > 1) {
        await interaction.reply(
            `"${searchString}" matches ${allMatchedCivs.length} civs currently included in your draft. Use the autocomplete to find the specific leader/civ you want to ban.`,
        );
        return;
    } else {
        const chosenCiv = allMatchedCivs[0];
        await banCivs(serverId, userData, [chosenCiv]);
        await interaction.reply(banMessage(chosenCiv, userData.game));
        return;
    }
}

function banMessage(bannedCiv: CivId, civGame: CivGame) {
    return `\`${renderCiv(getCiv(bannedCiv), civGame)}\` has been banned. It will no longer appear in your drafts.`;
}
