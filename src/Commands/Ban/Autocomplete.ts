import { AutocompleteInteraction } from "discord.js";
import { loadUserData } from "../../UserDataStore";
import { selectCivs } from "../Draft/SelectCivs";
import { Civ, renderCiv } from "../../Civs/Civs";

export async function banCommandAutocomplete(interaction: AutocompleteInteraction) {
    const queryString = interaction.options.getFocused();

    const userData = await loadUserData(interaction.guildId!);
    const userSettings = userData.userSettings[userData.game];

    await interaction.respond(
        autocompleteOptions(
            queryString,
            selectCivs(userSettings.defaultDraftSettings.expansions ?? [], userSettings.bannedCivs),
        ),
    );
}

export async function unbanCommandAutocomplete(interaction: AutocompleteInteraction) {
    const queryString = interaction.options.getFocused();

    const userData = await loadUserData(interaction.guildId!);
    const userSettings = userData.userSettings[userData.game];

    await interaction.respond(autocompleteOptions(queryString, userSettings.bannedCivs));
}

function autocompleteOptions(queryString: string, civs: Civ[]) {
    return civs
        .map(renderCiv)
        .filter((x) => x.includes(queryString))
        .slice(0, 25)
        .map((choice) => ({ name: choice, value: choice }));
}
