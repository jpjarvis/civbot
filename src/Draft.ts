import * as fs from 'fs'
import * as shuffle from 'shuffle-array'
import { Civ5CivGroup, Civ6CivGroup, CivGroup } from './CivGroups'
import UserData from './UserData'

export type Draft = Array<PlayerDraft>
export type PlayerDraft = Array<string>

interface CivData {
    civs: {
        [group in Civ5CivGroup | Civ6CivGroup]: string[]
    }
}

function getCivsJson(): CivData {
    return JSON.parse(fs.readFileSync("civs.json", "utf-8"))
}

async function getCivs(groups: Set<CivGroup>, serverId: string): Promise<string[]> {
    const civsJson = getCivsJson()

    const civs: string[] = Array.from(groups)
        .map((civGroup) => civsJson.civs[civGroup])
        .reduce((prev: string[], current: string[]) => current.concat(prev))

    if (groups.has("custom")) {
        const userData = await UserData.load(serverId)
        civs.concat(userData.customCivs)
    }

    return civs
}

export async function draft(numberOfPlayers: number, civsPerPlayer: number, civGroups: Set<CivGroup>, serverId: string): Promise<Draft> {
    const civs = await getCivs(civGroups, serverId)

    shuffle(civs)
    let draft: Draft = []
    for (let i = 0; i < numberOfPlayers; i++) {
        draft.push(civs.slice(i * civsPerPlayer, (i + 1) * civsPerPlayer));
    }

    return draft;
};