import {CommandInteraction, ModalSubmitInteraction} from "discord.js";
import {loadUserData} from "../UserDataStore";
import {isFeatureEnabled} from "../UserData/FeatureFlags";

function addWowser(message: string) {
    return `Wowser!\n${message}`;
}

export async function civBotReply(interaction: CommandInteraction | ModalSubmitInteraction, message: string) {
    const userData = await loadUserData(interaction.guildId!);
    
    if (isFeatureEnabled(userData, "Wowser")) {
        return await interaction.reply(addWowser(message));
    }
    else {
        return await interaction.reply(message);
    }
}