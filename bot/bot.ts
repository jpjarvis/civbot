import { Message, VoiceChannel } from "discord.js"
import { Client } from "@typeit/discord"
import {draft, PlayerDraft} from "./draft.js"
import Messages from "./messages.js"

var client = new Client()
var auth = require('./auth.json')

function getPlayerDraftString(playerName: string, playerDraft: PlayerDraft) : string
{
    let response = `${playerName} `.padEnd(20, " ")
    for (let j=0; j<playerDraft.length-1; j++)
    {
        response += `${playerDraft[j]} / `
    }
    response += `${playerDraft[playerDraft.length-1]}\n`
    return response
}

function extractArgValue(args: Array<string>, argName: string) : number | undefined
{
    let index = args.findIndex((a) => a === argName)

    if (index >= 0) {
        let result = parseInt(args[index+1])
        if (isNaN(result))
        {
            // Badly formed, so we give an error
            return undefined
        }

        return result
    }
}

client.on('ready', () => 
{
    console.log(`Logged in as ${client.user!.tag}!`)
})

client.on('message', (msg: Message) => 
{
    if (msg.content.startsWith('civbot'))
    {
        let args = msg.content.split(" ")

        msg.channel.send(Messages.Wowser)

        // civbot
        if (args.length == 1) 
        {
            msg.channel.send(Messages.Info)
        }

        // civbot draft
        if (args[1] === 'draft') 
        {
            let ai = 0
            let numCivs = 3
            let useVoice = true
            let useLekmod = false
            
            if (args.includes("ai")) 
            {
                let ai = extractArgValue(args, "ai")
                if (ai === undefined) 
                {
                    msg.channel.send(Messages.BadlyFormed)
                    return
                }
            }

            if (args.includes("civs")) 
            {
                let numCivs = extractArgValue(args, "civs")
                if (numCivs === undefined) 
                {
                    msg.channel.send(Messages.BadlyFormed)
                    return
                }
            }

            useVoice = !args.includes("novoice")
            let disableVanilla = args.includes("lekmod-only")
            useLekmod = args.includes("lekmod") || disableVanilla

            let voiceChannel = client.channels.cache.get(msg.member!.voice.channelID!) as VoiceChannel | undefined
            if (voiceChannel === undefined)
            {
                msg.channel.send(Messages.NotInVoice)
                useVoice = false
            }

            let voicePlayers = useVoice ? voiceChannel!.members.size : 0

            let draftResult = draft(voicePlayers + ai, numCivs, useLekmod, disableVanilla)
            let currentEntry = 0;
            let response = ""
            if (useVoice) 
            {
                voiceChannel!.members.forEach(function(member)
                {
                    response += getPlayerDraftString(member.user.username, draftResult[currentEntry])
                    currentEntry++
                })
            }

            for (let i=0; i<ai; i++) 
            {
                response += getPlayerDraftString(`AI ${i+1}`, draftResult[currentEntry])
                currentEntry++
            }

            if (response === "")
            {
                msg.channel.send(Messages.DraftFailed)
            }
            else
            {
                msg.channel.send( "\`\`\`" + response + "\`\`\`")
            }
        }

        // civbot help
        if (args[1] === 'help')
        {
            msg.channel.send(Messages.Help)
        }
    }
})

client.login(auth.token);
