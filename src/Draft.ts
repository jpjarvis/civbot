import * as fs from 'fs'
import * as shuffle from 'shuffle-array'

export type Draft = Array<PlayerDraft>
export type PlayerDraft = Array<string>

class CivData {
    civs!: {
        vanilla: Array<string>
        lekmod: Array<string>
    }
}

function getCivsJson(): CivData {
    return JSON.parse(fs.readFileSync("civs.json", "utf-8"))
}

function getCivs(group: string): Array<string> {
    return getCivsJson().civs[group]
}

export function draft(numberOfPlayers: number, civsPerPlayer: number, civGroups: Set<string>, customCivs: Array<string>): Draft {
    let civs = Array.from(civGroups)
        .map((group: string) => getCivs(group))
        .reduce((previous, current) => previous.concat(current))
        .concat(customCivs)

    shuffle(civs)
    let draft: Draft = []
    for (let i = 0; i < numberOfPlayers; i++) {
        draft.push(civs.slice(i * civsPerPlayer, (i + 1) * civsPerPlayer));
    }

    return draft;
};