var Discord = require('discord.js')
var client = new Discord.Client()
var auth = require('./auth.json')
var fs = require('fs')
var shuffle = require('shuffle-array')

var civs = JSON.parse(fs.readFileSync("civs.json")).civs

function getDraft(numberOfPlayers, civsPerPlayer) {
    shuffle(civs)
    draft = []
    for (i=0; i<numberOfPlayers; i++)
    {
        draft.push(civs.slice(i*civsPerPlayer, (i+1)*civsPerPlayer));
    }
    return draft
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', msg => {
    if (msg.content === '!draft') {
        draft = getDraft(5,3)
        console.log(draft)
        message = ""
        for (i=0; i<draft.length; i++)
        {
            message += `Player ${i} - `
            for (j=0; j<draft[i].length-1; j++)
            {
                message += `${draft[i][j]} / `
            }
            message += `${draft[i][draft[i].length-1]}\n`
        }
        msg.channel.send(message)
    }
})

client.login(auth.token);