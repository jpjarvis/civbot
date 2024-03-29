import { Draft, DraftError } from "./DraftTypes";
import * as shuffle from "shuffle-array";
import { Result } from "../../Functional/Result";
import { Civ } from "../../Civs/Civs";

function assignCivs(players: string[], civsPerPlayer: number, civs: Civ[]): Draft {
    shuffle(civs);

    return players.map((player, index) => {
        return { player: player, civs: civs.slice(index * civsPerPlayer, (index + 1) * civsPerPlayer) };
    });
}

export function draft(players: string[], civsPerPlayer: number, civs: Civ[]): Result<Draft, DraftError> {
    if (players.length == 0) {
        return { isError: true, error: "no-players" };
    }

    if (players.length * civsPerPlayer > civs.length) {
        return { isError: true, error: "not-enough-civs" };
    }

    let draft = assignCivs(players, civsPerPlayer, civs);

    return { isError: false, value: draft };
}
