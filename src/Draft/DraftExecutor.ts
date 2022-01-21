import {CivGroup} from "./Types/CivGroups";
import {Draft, DraftResult} from "./Types/DraftTypes";
import {CivsRepository} from "./CivsRepository";
import * as shuffle from "shuffle-array";

export interface IDraftExecutor {
    executeDraft(players: string[], civsPerPlayer: number, civGroups: CivGroup[], serverId: string): Promise<DraftResult>
}

function assignCivs(players: string[], civsPerPlayer: number, civs: string[]): Draft {
    shuffle(civs);
    let draft: Draft = new Map<string, string[]>();
    for (let i = 0; i < players.length; i++) {
        draft[players[i]] = civs.slice(i * civsPerPlayer, (i + 1) * civsPerPlayer);
    }

    return draft;
}

export class DraftExecutor implements IDraftExecutor {
    private civsRepository: CivsRepository
    
    constructor(civsRepository: CivsRepository) {
        this.civsRepository = civsRepository
    }
    
    async executeDraft(players: string[], civsPerPlayer: number, civGroups: CivGroup[], tenantId: string): Promise<DraftResult> {
        if (players.length == 0) {
            return {success: false, error: "no-players"}
        }

        let civs = await this.civsRepository.getCivs(new Set(civGroups), tenantId)

        if (players.length * civsPerPlayer > civs.length) {
            return {success: false, error: "not-enough-civs"}
        }

        let draft = assignCivs(players, civsPerPlayer, civs)

        return {success: true, draft: draft};
    }
}

