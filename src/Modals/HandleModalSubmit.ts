import { ModalSubmitInteraction } from "discord.js";
import { loadUserData, saveUserData } from "../UserDataStore";
import {civBotReply} from "../Discord/CivBotReply";

export async function handleModalSubmit(interaction: ModalSubmitInteraction) {
    if (interaction.customId === "customCivs") {
        await handleCustomCivsModal(interaction);
    } else {
        throw Error("Unrecognised modal");
    }
}

async function handleCustomCivsModal(interaction: ModalSubmitInteraction) {
    const serverId = interaction.guildId!;
    const userData = await loadUserData(serverId);
    const civs = interaction.fields
        .getTextInputValue("customCivsInput")
        .split("\n")
        .filter((x) => x.trim().length > 0);

    userData.userSettings[userData.game].customCivs = civs;
    await saveUserData(serverId, userData);
    await civBotReply(interaction, `Custom civs updated. You now have ${civs.length} custom civs.`);
}
