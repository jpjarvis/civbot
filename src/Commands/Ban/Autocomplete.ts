import { AutocompleteInteraction } from "discord.js";
import { loadUserData } from "../../UserDataStore";
import { selectCivs } from "../Draft/SelectCivs";
import { renderCiv } from "../../Civs/Civs";

export async function banCommandAutocomplete(interaction: AutocompleteInteraction) {
    const queryString = interaction.options.getFocused();

    const userData = await loadUserData(interaction.guildId!);
    const userSettings = userData.userSettings[userData.game];
    const choices = selectCivs(userSettings.defaultDraftSettings.expansions ?? [], userSettings.bannedCivs)
        .map(renderCiv)
        .filter((x) => x.includes(queryString))
        .slice(0,25);

    await interaction.respond(choices.map(choice => ({name: choice, value: choice})));
}

export async function unbanCommandAutocomplete(interaction: AutocompleteInteraction) {
    const queryString = interaction.options.getFocused();

    const userData = await loadUserData(interaction.guildId!);
    const userSettings = userData.userSettings[userData.game];
    const choices = userSettings.bannedCivs
        .map(renderCiv)
        .filter((x) => x.includes(queryString))
        .slice(0,25);

    await interaction.respond(choices.map(choice => ({name: choice, value: choice})));
}
