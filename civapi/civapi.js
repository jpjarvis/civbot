var express = require('express')
var app = express()
var fs = require('fs')
var shuffle = require('shuffle-array')

BASEURL = "/civapi"

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

app.get(BASEURL + "/draft", function(req, res) {

    numberOfPlayers = req.query.numberOfPlayers
    civsPerPlayer = req.query.civsPerPlayer
    useLekmod = req.query.useLekmod
    disableVanilla = req.query.disableVanilla

    civs = useLekmod === 'true' ? (disableVanilla === 'true' ? getLekmodOnlyCivs() : getLekmodCivs()) : getTakmodCivs()

    shuffle(civs)
    draft = []
    for (i=0; i<numberOfPlayers; i++)
    {
        draft.push(civs.slice(i*civsPerPlayer, (i+1)*civsPerPlayer));
    }
    
    res.setHeader('Content-Type', 'application/json')
    res.send(draft)

})



var port = (process.env.PORT || 8080)

var server = app.listen(port, function() {
    console.log("CivAPI is running on localhost:" + port);
})
