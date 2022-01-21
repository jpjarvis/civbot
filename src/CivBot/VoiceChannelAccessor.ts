import {VoiceChannel} from "discord.js";

export interface VoiceChannelAccessor {
    getUsersInVoice(): string[] | undefined;
}

export class DiscordVoiceChannelAccessor implements VoiceChannelAccessor{
    private voiceChannel: VoiceChannel;

    constructor(voiceChannel: VoiceChannel) {
        this.voiceChannel = voiceChannel;
    }

    getUsersInVoice(): string[] {
        return this.voiceChannel.members.map(m => m.user.username);
    }
}

export class EmptyVoiceChannelAccessor implements VoiceChannelAccessor {
    getUsersInVoice(): string[] | undefined {
        return undefined;
    }
}
