var express = require('express')
var app = express()
var fs = require('fs')
var shuffle = require('shuffle-array')

BASEURL = "/civapi"

app.get(BASEURL + "/draft", function(req, res) {

    numberOfPlayers = req.query.numberOfPlayers
    civsPerPlayer = req.query.civsPerPlayer

    civs = JSON.parse(fs.readFileSync("civs.json")).civs
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