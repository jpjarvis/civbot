import { AutocompleteInteraction } from "discord.js";
import { loadUserData } from "../../UserDataStore";
import { selectCivIds } from "../../Civs/SelectCivIds";
import {CivId, getCiv, renderCiv} from "../../Civs/Civs";
import {CivGame} from "../../Civs/CivGames";

export async function banCommandAutocomplete(interaction: AutocompleteInteraction) {
    const queryString = interaction.options.getFocused();

    const userData = await loadUserData(interaction.guildId!);
    const userSettings = userData.userSettings[userData.game];

    await interaction.respond(
        autocompleteOptions(
            queryString,
            selectCivIds(userSettings.defaultDraftSettings.expansions ?? [], userSettings.bannedCivs),
            userData.game
        ),
    );
}

export async function unbanCommandAutocomplete(interaction: AutocompleteInteraction) {
    const queryString = interaction.options.getFocused();

    const userData = await loadUserData(interaction.guildId!);
    const userSettings = userData.userSettings[userData.game];

    await interaction.respond(autocompleteOptions(queryString, userSettings.bannedCivs, userData.game));
}

function autocompleteOptions(queryString: string, civs: CivId[], game: CivGame) {
    return civs
        .map(x => renderCiv(getCiv(x), game))
        .filter((x) => x.includes(queryString))
        .slice(0, 25)
        .map((choice) => ({ name: choice, value: choice }));
}
