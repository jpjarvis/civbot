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

function getPlayerDraftString(playerName, playerDraft) {
    message = `${playerName} - `
    for (j=0; j<playerDraft.length-1; j++)
    {
        message += `${playerDraft[j]} / `
    }
    message += `${playerDraft[playerDraft.length-1]}\n`
    return message
}

function extractArgValue(args, argName) {
    index = args.findIndex((a) => a === argName)

    if (index >= 0) {
        result = parseInt(args[index+1])
        if (isNaN(result))
        {
            // Badly formed, so we give an error
            return undefined
        }

        return result
    }
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', msg => {
    if (msg.content.startsWith('!draft')) {
        ai = 0
        numCivs = 3
        useVoice = true

        args = msg.content.split(" ")
        
        if (args.includes("ai")) {
            ai = extractArgValue(args, "ai")
            if (ai === undefined) {
                msg.channel.send("Command is badly formed - see !help for guidance")
                return
            }
        }

        if (args.includes("civs")) {
            numCivs = extractArgValue(args, "civs")
            if (numCivs === undefined) {
                msg.channel.send("Command is badly formed - see !help for guidance")
                return
            }
        }

        useVoice = !args.includes("novoice")

        voiceChannel = client.channels.get("493399082757259288")
        voicePlayers = useVoice ? voiceChannel.members.size : 0

        draft = getDraft(voicePlayers + ai, numCivs)
        currentEntry = 0;
        message = ""

        if (useVoice) {
            voiceChannel.members.forEach(function(member){
                message += getPlayerDraftString(member.user.username, draft[currentEntry])
                currentEntry++
            })
        }

        for (i=0; i<ai; i++) {
            message += getPlayerDraftString(`AI ${i+1}`, draft[currentEntry])
            currentEntry++
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
                - civs [NUMBER] : Change the number of civs for each player
                - ai [NUMBER] : Add a specified number of AI players
                - novoice : Don't include players from voice
            eg. !draft numcivs 5 ai 2
            Drafts a game with everyone in voice plus 2 AI, and everyone picks from 5 civs.`)
    }
})

client.login(auth.token);