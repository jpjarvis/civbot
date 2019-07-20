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
    response = `${playerName} `.padEnd(20, " ")
    for (j=0; j<playerDraft.length-1; j++)
    {
        response += `${playerDraft[j]} / `
    }
    response += `${playerDraft[playerDraft.length-1]}\n`
    return response
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

function sendBadlyFormedError(channel) {
    channel.send("Command is badly formed - see !help for guidance")
}

function sendDraftFailedError(channel) {
    channel.send("Draft failed - no members in voice and no additional players specified")
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
                sendBadlyFormedError(msg.channel)
                return
            }
        }

        if (args.includes("civs")) {
            numCivs = extractArgValue(args, "civs")
            if (numCivs === undefined) {
                sendBadlyFormedError(msg.channel)
                return
            }
        }

        useVoice = !args.includes("novoice")

        voiceChannel = client.channels.get("493399082757259288")
        voicePlayers = useVoice ? voiceChannel.members.size : 0

        draft = getDraft(voicePlayers + ai, numCivs)
        currentEntry = 0;
        response = ""

        if (useVoice) {
            voiceChannel.members.forEach(function(member){
                response += getPlayerDraftString(member.user.username, draft[currentEntry])
                currentEntry++
            })
        }

        for (i=0; i<ai; i++) {
            response += getPlayerDraftString(`AI ${i+1}`, draft[currentEntry])
            currentEntry++
        }

        if (response === "")
        {
            sendDraftFailedError(msg.channel)
        }
        else
        {
            msg.channel.send( "\`\`\`" + response + "\`\`\`")
        }
    }

    if (msg.content === '!help')
    {
        msg.channel.send(
            `Hi, I'm CivBot. Use me to draft civ games, it's all I'm good for.
            \`\`\`!draft [OPTIONS]
            Drafts 3 civs for each player in the voice channel. Additional options:
                - civs [NUMBER] : Change the number of civs for each player
                - ai [NUMBER] : Add a specified number of AI players
                - novoice : Don't include players from voice
            eg. !draft numcivs 5 ai 2
            Drafts a game with everyone in voice plus 2 AI, and everyone picks from 5 civs.\`\`\``)
    }
})

client.login(auth.token);