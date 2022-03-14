import {Draft, DraftError} from "./DraftTypes";
import * as shuffle from "shuffle-array";
import {ResultOrErrorWithDetails} from "../../Types/ResultOrError";

function assignCivs(players: string[], civsPerPlayer: number, civs: string[]): Draft {
    shuffle(civs);
    let draft: Draft = new Map<string, string[]>();
    for (let i = 0; i < players.length; i++) {
        draft[players[i]] = civs.slice(i * civsPerPlayer, (i + 1) * civsPerPlayer);
    }

    return draft;
}

export function draft(players: string[], civsPerPlayer: number, civs: string[]): ResultOrErrorWithDetails<Draft, DraftError> {
    if (players.length == 0) {
        return {isError: true, error: "no-players"}
    }
    
    if (players.length * civsPerPlayer > civs.length) {
        return {isError: true, error: "not-enough-civs"}
    }
    
    let draft = assignCivs(players, civsPerPlayer, civs)
    
    return {isError: false, result: draft};
}

