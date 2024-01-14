import {
    ActionRowBuilder,
    ModalActionRowComponentBuilder,
    ModalBuilder,
    TextInputBuilder
} from "discord.js";

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


