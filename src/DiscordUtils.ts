import { Client, GuildMember, VoiceChannel } from "discord.js"

export async function getVoiceChannel(client: Client, member: GuildMember): Promise<VoiceChannel | undefined> {
    const channelId = member.voice.channelID

    if (!channelId) {
        return undefined
    }

    return await client.channels.fetch(channelId) as VoiceChannel
}