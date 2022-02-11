import {Draft, DraftResult} from "./Types/DraftTypes";
import * as shuffle from "shuffle-array";

function assignCivs(players: string[], civsPerPlayer: number, civs: string[]): Draft {
    shuffle(civs);
    let draft: Draft = new Map<string, string[]>();
    for (let i = 0; i < players.length; i++) {
        draft[players[i]] = civs.slice(i * civsPerPlayer, (i + 1) * civsPerPlayer);
    }

    return draft;
}

export async function draft(players: string[], civsPerPlayer: number, civs: string[]): Promise<DraftResult> {
    if (players.length == 0) {
        return {success: false, error: "no-players"}
    }
    
    if (players.length * civsPerPlayer > civs.length) {
        return {success: false, error: "not-enough-civs"}
    }
    
    let draft = assignCivs(players, civsPerPlayer, civs)
    
    return {success: true, draft: draft};
}

