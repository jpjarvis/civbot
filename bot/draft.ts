const fs = require('fs')
const shuffle = require('shuffle-array')

export type Draft = Array<PlayerDraft>
export type PlayerDraft = Array<string>

function getTakmodCivs(): Array<string>
{
    return JSON.parse(fs.readFileSync("civs.json")).civs.vanilla
}

function getLekmodCivs(): Array<string>
{
    let civJson = JSON.parse(fs.readFileSync("civs.json")).civs
    return civJson.vanilla.concat(civJson.lekmod)
}

function getLekmodOnlyCivs(): Array<string>
{
    return JSON.parse(fs.readFileSync("civs.json")).civs.lekmod
}

export function draft(numberOfPlayers: number, civsPerPlayer: number, useLekmod: boolean, disableVanilla: boolean) : Draft
{
    let civs = useLekmod ? (disableVanilla ? getLekmodOnlyCivs() : getLekmodCivs()) : getTakmodCivs()

    shuffle(civs)
    let draft : Draft = []
    for (let i=0; i<numberOfPlayers; i++)
    {
        draft.push(civs.slice(i*civsPerPlayer, (i+1)*civsPerPlayer));
    }

    return draft;
};