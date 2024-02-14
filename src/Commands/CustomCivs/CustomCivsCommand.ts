import {
    ActionRowBuilder,
    ChatInputCommandInteraction,
    ModalActionRowComponentBuilder,
    ModalBuilder,
    TextInputBuilder
} from "discord.js";
import {loadUserData} from "../../UserDataStore";

export async function customCivsCommand(interaction: ChatInputCommandInteraction) {
    const serverId = interaction.guildId!;
    const userData = await loadUserData(serverId);

    await interaction.showModal(customCivsModal(userData.userSettings[userData.game].customCivs));
}

export function customCivsModal(customCivs: string[]) {
    const modal = new ModalBuilder()
        .setCustomId("customCivs")
        .setTitle("Custom civs")

    const customCivsInput = new TextInputBuilder()
        .setCustomId("customCivsInput")
        .setLabel("Add custom civs below, one per line.")
        .setStyle(2)
        .setMinLength(0)
        .setRequired(false)
        .setValue(customCivs.join("\n"))

    const actionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(customCivsInput);

    modal.addComponents(actionRow);

    return modal;
}