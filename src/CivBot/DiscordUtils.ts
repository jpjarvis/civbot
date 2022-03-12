import {Client, CommandInteraction, GuildMember, VoiceChannel} from "discord.js";

export async function getVoiceChannel(client: Client, member: GuildMember): Promise<VoiceChannel | undefined> {
    const channelId = member.voice.channelId;

    if (!channelId) {
        return undefined;
    }

    return await client.channels.fetch(channelId) as VoiceChannel;
}

export async function getVoiceChannelMembers(interaction: CommandInteraction) : Promise<string[]> {
    let voiceChannel: VoiceChannel | undefined = undefined;
    const member = interaction.member;
    if (member instanceof GuildMember) {
        voiceChannel = await getVoiceChannel(interaction.client, member);
        if (voiceChannel) {
            return voiceChannel.members.map(m => m.user.username);
        }
    }

    return [];
}