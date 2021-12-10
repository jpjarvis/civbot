import {CivGroup} from "./CivGroups";
import {VoiceChannel} from "discord.js";
import {Draft} from "./DraftTypes";
import {assignCivs} from "./AssignCivs";
import {CivsRepository} from "./CivsRepository/interface";

export type DraftError = "no-players" | "not-enough-civs"
type DraftResult = {success: true, draft: Draft} | {success: false, error: DraftError}

export interface DraftArguments {
    numberOfAi: number,
    numberOfCivs: number,
    noVoice: boolean,
    civGroups: CivGroup[]
}

export interface IDraftExecutor {
    executeDraft(args: DraftArguments, voiceChannel: VoiceChannel | undefined, serverId: string, civsRepository: CivsRepository): Promise<DraftResult>
}

export class DraftExecutor implements IDraftExecutor {
    async executeDraft(args: DraftArguments, voiceChannel: VoiceChannel | undefined, serverId: string, civsRepository: CivsRepository): Promise<DraftResult> {
        const useVoice = voiceChannel && !args.noVoice;
        let players : Array<string> = []
        if (useVoice) {
            players.concat(voiceChannel.members.map(m => m.user.username))
        }
        for (let i=0; i<args.numberOfAi; i++) {
            players.push(`AI ${i}`)
        }

        if (players.length == 0) {
            return {success: false, error: "no-players"}
        }

        let civs = await civsRepository.getCivs(new Set(args.civGroups), serverId)

        if (players.length * args.numberOfCivs > civs.length) {
            return {success: false, error: "not-enough-civs"}
        }

        let draft = assignCivs(players, args.numberOfCivs, civs)

        return {success: true, draft: draft};
    }
}

