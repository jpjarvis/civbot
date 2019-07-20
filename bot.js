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
    channel.send("Command is badly formed - see `civbot help` for guidance")
}

function sendDraftFailedError(channel) {
    channel.send("Draft failed - no members in voice and no additional players specified")
}

function sendHelpMessage(channel) {
    channel.send(
        `\`\`\`civbot draft [OPTIONS]
        Drafts 3 civs for each player in the voice channel. Additional options:
            - civs [NUMBER] : Change the number of civs for each player
            - ai [NUMBER] : Add a specified number of AI players
            - novoice : Don't include players from voice
        eg. civbot draft numcivs 5 ai 2
        Drafts a game with everyone in voice plus 2 AI, and everyone picks from 5 civs.\`\`\``)
}

function sendInfoMessage(channel)
{
    channel.send("Hi, I'm CivBot. Use me to draft civ games with `civbot draft`, it's all I'm good for. \nTo find out more about drafting games, try `civbot help`.")
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', msg => {
    if (msg.content.startsWith('civbot'))
    {
        args = msg.content.split(" ")

        // civbot
        if (args.length == 1) {
            sendInfoMessage(msg.channel)
        }

        // civbot draft
        if (args[1] === 'draft') {
            ai = 0
            numCivs = 3
            useVoice = true

            
            
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

        // civbot help
        if (args[1] === 'help')
        {
            sendHelpMessage(msg.channel)
        }
    }
})

client.login(auth.token);