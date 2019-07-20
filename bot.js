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
        voiceChannel = client.channels.get("493399082757259288")

        draft = getDraft(voiceChannel.members.size,3)
        
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

        if (message === "")
        {
            msg.channel.send("Draft failed - no members in voice and no additional players specified")
        }
        else
        {
            msg.channel.send(message)
        }
    }

    if (msg.content === '!help')
    {
        msg.channel.send(
            `Hi, I'm CivBot. Use me to draft civ games, it's all I'm good for.
            
            !draft [OPTIONS]
            Drafts 3 civs for each player in the voice channel. Additional options:
                - numcivs [NUMBER] : Change the number of civs for each player
                - ai [NUMBER] : Add a specified number of AI players
                - novoice : Don't include players from voice
            eg. !draft numcivs 5 ai 2
            Drafts a game with everyone in voice plus 2 AI, and everyone picks from 5 civs.`)
    }
})

client.login(auth.token);