import { VoiceChannel } from "discord.js"
import { CivGroup } from "./CivGroups"
import { draft, PlayerDraft } from "./Draft"
import Messages from "./Messages"
import {UserDataStoreInstance} from "./UserDataStore";

export interface DraftArguments {
    numberOfAi: number,
    numberOfCivs: number,
    noVoice: boolean,
    civGroups: CivGroup[]
}

function getPlayerDraftString(playerName: string, playerDraft: PlayerDraft): string {
    let response = `${playerName} `.padEnd(20, " ")
    for (let j = 0; j < playerDraft.length - 1; j++) {
        response += `${playerDraft[j]} / `
    }
    response += `${playerDraft[playerDraft.length - 1]}\n`
    return response
}

export async function draftCommand(args: Partial<DraftArguments>, voiceChannel: VoiceChannel | undefined, serverId: string, sendMessage: (message: string) => void): Promise<void> {
    const defaultArgs = (await UserDataStoreInstance.load(serverId)).defaultDraftSettings

    const numberOfAi = args.numberOfAi ?? 0
    const numberOfCivs = args.numberOfCivs ?? 3
    const noVoice = args.noVoice ?? false
    const civGroups = args.civGroups ?? defaultArgs.civGroups ?? ["civ5-vanilla"]

    if (!voiceChannel) {
        sendMessage(Messages.NotInVoice)
    }
    const useVoice = voiceChannel && !noVoice

    let voicePlayers = useVoice ? voiceChannel!.members.size : 0

    let draftResult = await draft(voicePlayers + numberOfAi, numberOfCivs, new Set(civGroups), serverId)
    let currentEntry = 0;
    let response = ""
    if (useVoice) {
        voiceChannel!.members.forEach(function (member) {
            response += getPlayerDraftString(member.user.username, draftResult[currentEntry])
            currentEntry++
        })
    }

    for (let i = 0; i < numberOfAi; i++) {
        response += getPlayerDraftString(`AI ${i + 1}`, draftResult[currentEntry])
        currentEntry++
    }

    if (response === "") {
        sendMessage(Messages.DraftFailed)
    }
    else {
        sendMessage(`Drafting for ${civGroups.map(cg => `\`${cg}\``).join(", ")}`)
        sendMessage("\`\`\`" + response + "\`\`\`")
    }
}