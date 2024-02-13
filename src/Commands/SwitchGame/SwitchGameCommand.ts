import {loadUserData, saveUserData} from "../../UserDataStore";
import {CivGame} from "../../Civs/CivGames";
import {ChatInputCommandInteraction} from "discord.js";
import {updateSlashCommandsForServer} from "../../Discord/SlashCommands/UpdateSlashCommands";

export async function handleSwitchGame(interaction: ChatInputCommandInteraction) {
    const serverId = interaction.guildId!;

    const game = await switchGame(serverId);

    await updateSlashCommandsForServer(interaction.client, serverId);

    await interaction.reply(`Switched to drafting for ${game}.`);
}

async function switchGame(tenantId: string) {
    const userData = await loadUserData(tenantId);
    const game: CivGame = userData.game === "Civ 5" ? "Civ 6" : "Civ 5";
    await saveUserData(tenantId, {...userData, game});
    return game;
}