import * as shuffle from "shuffle-array";
import {Draft} from "./DraftTypes";

export function assignCivs(players: string[], civsPerPlayer: number, civs: string[]): Draft {
    shuffle(civs);
    let draft: Draft = new Map<string, string[]>();
    for (let i = 0; i < players.length; i++) {
        draft[players[i]] = civs.slice(i * civsPerPlayer, (i + 1) * civsPerPlayer);
    }

    return draft;
}