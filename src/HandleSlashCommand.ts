import { Client, CommandInteraction, Interaction } from "discord.js"
import { draftCommand } from "./DraftCommand"

async function draft(
    ai: number,
    civs: number,
    novoice: boolean,
    interaction: CommandInteraction
) {
    await draftCommand({
        numberOfCivs: civs,
        numberOfAi: ai,
        noVoice: novoice,
        civGroups: new Set(["civ5-vanilla"])
    }, undefined, "", (message) => { interaction.channel?.send(message) })
}

export async function handleSlashCommand(command: CommandInteraction, client: Client) {
    if (command.commandName === "draft") {
        const ai = command.options.getInteger("ai") ?? 0
        const civs = command.options.getInteger("civs") ?? 3
        const noVoice = command.options.getBoolean("no-voice") ?? false

        await draft(ai, civs, noVoice, command)
    }
}