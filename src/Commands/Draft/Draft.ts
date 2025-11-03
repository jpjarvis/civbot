import {Draft, DraftedCiv, DraftError} from "./DraftTypes";
import * as shuffle from "shuffle-array";
import {Result} from "../../Functional/Result";
import {getCiv} from "../../Civs/Civs";

function assignCivs(players: string[], civsPerPlayer: number, civs: DraftedCiv[]): Draft {
    shuffle(civs);

    return players.map((player, index) => {
        return {player: player, civs: civs.slice(index * civsPerPlayer, (index + 1) * civsPerPlayer)};
    });
}

export function draftWithGuaranteedCoastal(players: string[], civsPerPlayer: number, civs: DraftedCiv[]): Result<Draft, DraftError> {
    const coastalCivs = civs.filter(x => !x.custom && getCiv(x.id).coastal);

    if (coastalCivs.length < players.length) {
        return {isError: true, error: "not-enough-coastal-civs"}
    }

    shuffle(coastalCivs);
    const chosenCoastalCivs = coastalCivs.slice(0, players.length);

    const draftResult = draft(players, civsPerPlayer - 1, civs.filter(x => !coastalCivs.includes(x)));

    if (!draftResult.isError) {
        const draftEntriesWithCoastal = draftResult.value.map((draftEntry, i) => ({
            ...draftEntry,
            civs: draftEntry.civs.concat([chosenCoastalCivs[i]])
        }))

        return {
            isError: false,
            value: draftEntriesWithCoastal
        }
    }

    return draftResult;
}

export function draft(players: string[], civsPerPlayer: number, civs: DraftedCiv[]): Result<Draft, DraftError> {
    if (players.length == 0) {
        return {isError: true, error: "no-players"};
    }

    if (players.length * civsPerPlayer > civs.length) {
        return {isError: true, error: "not-enough-civs"};
    }

    let draft = assignCivs(players, civsPerPlayer, civs);

    return {isError: false, value: draft};
}
