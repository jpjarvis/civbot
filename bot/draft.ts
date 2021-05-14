const fs = require('fs')
const shuffle = require('shuffle-array')

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

module.exports = function draft(numberOfPlayers: number, civsPerPlayer: number, useLekmod: boolean, disableVanilla: boolean) 
{
    let civs = useLekmod ? (disableVanilla ? getLekmodOnlyCivs() : getLekmodCivs()) : getTakmodCivs()

    shuffle(civs)
    let draft : Array<Array<string>> = []
    for (let i=0; i<numberOfPlayers; i++)
    {
        draft.push(civs.slice(i*civsPerPlayer, (i+1)*civsPerPlayer));
    }

    return draft;
};