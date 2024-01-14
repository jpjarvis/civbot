import {ModalSubmitInteraction} from "discord.js";
import {loadUserData, saveUserData} from "../../UserDataStore";

export async function handleModalSubmit(interaction: ModalSubmitInteraction) {
    if (interaction.customId === "customCivs") {
        await handleCustomCivsModal(interaction);
    }
    else {
        throw Error("Unrecognised modal");
    }
}

async function handleCustomCivsModal(interaction: ModalSubmitInteraction) {
    let serverId = interaction.guildId!;
    const userData = await loadUserData(serverId);
    const civs = interaction.fields.getTextInputValue("customCivsInput").split("\n");

    userData.userSettings[userData.game].customCivs = civs;
    await saveUserData(serverId, userData);
    await interaction.reply(`Custom civs updated. You now have ${civs.length} custom civs.`);
}
