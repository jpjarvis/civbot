var fs = require('fs')
var shuffle = require('shuffle-array')

function getTakmodCivs()
{
    return JSON.parse(fs.readFileSync("civs.json")).civs.vanilla
}

function getLekmodCivs()
{
    civJson = JSON.parse(fs.readFileSync("civs.json")).civs
    return civJson.vanilla.concat(civJson.lekmod)
}

function getLekmodOnlyCivs()
{
    return JSON.parse(fs.readFileSync("civs.json")).civs.lekmod
}

function draft(numberOfPlayers, civsPerPlayer, useLekmod, disableVanilla) 
{
    civs = useLekmod === 'true' ? (disableVanilla === 'true' ? getLekmodOnlyCivs() : getLekmodCivs()) : getTakmodCivs()

    shuffle(civs)
    draft = []
    for (i=0; i<numberOfPlayers; i++)
    {
        draft.push(civs.slice(i*civsPerPlayer, (i+1)*civsPerPlayer));
    }

    return draft;
}

module.exports = draft;