import { CommandInteraction, GuildMember, VoiceChannel } from "discord.js"
import { getVoiceChannel } from "./DiscordUtils"
import { draftCommand } from "./DraftCommand"

async function handleDraft(interaction: CommandInteraction) {
    const ai = interaction.options.getInteger("ai") ?? 0
    const civs = interaction.options.getInteger("civs") ?? 3
    const noVoice = interaction.options.getBoolean("no-voice") ?? false

    let response = ""
    let voiceChannel: VoiceChannel | undefined = undefined
    const member = interaction.member
    if (member instanceof GuildMember) {
        voiceChannel = await getVoiceChannel(interaction.client, member)
    }

    await draftCommand(
        {
            numberOfCivs: civs,
            numberOfAi: ai,
            noVoice: noVoice,
            civGroups: new Set(["civ5-vanilla"])
        },
        voiceChannel,
        "",
        (message) => { response += message + "\n" })

    interaction.reply(response)
}

export async function handleSlashCommand(interaction: CommandInteraction) {
    if (interaction.commandName === "draft") {
        await handleDraft(interaction)
    }
}