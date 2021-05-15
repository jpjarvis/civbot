import { DMChannel, Message, NewsChannel, TextChannel, VoiceChannel } from "discord.js"
import { Client, Discord, On } from "@typeit/discord"
import {draft, Draft, PlayerDraft} from "./draft.js"

var client = new Client()
var auth = require('./auth.json')

type DiscordTextChannel = TextChannel | DMChannel | NewsChannel

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

function sendBadlyFormedError(channel: DiscordTextChannel) 
{
    channel.send("Command is badly formed - see `civbot help` for guidance")
}

function sendDraftFailedError(channel: DiscordTextChannel) 
{
    channel.send("Draft failed - no players found. Either join voice or set some AI.")
}

function sendHelpMessage(channel: DiscordTextChannel) 
{
    channel.send(
        `\`\`\`civbot draft [OPTIONS]
        Drafts 3 civs for each player in the voice channel. Additional options:
            - civs [NUMBER] : Change the number of civs for each player
            - ai [NUMBER] : Add a specified number of AI players
            - novoice : Don't include players from voice
            - lekmod : Include lekmod civs
            - lekmod-only : Only use lekmod civs (no vanilla)
        eg. civbot draft numcivs 5 ai 2
        Drafts a game with everyone in voice plus 2 AI, and everyone picks from 5 civs.\`\`\``)
}

function sendInfoMessage(channel: DiscordTextChannel)
{
    channel.send("Hi, I'm CivBot. Use me to draft civ games with `civbot draft`, it's all I'm good for. \nTo find out more about drafting games, try `civbot help`.")
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

        msg.channel.send("Wowser!")

        // civbot
        if (args.length == 1) 
        {
            sendInfoMessage(msg.channel)
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
                    sendBadlyFormedError(msg.channel)
                    return
                }
            }

            if (args.includes("civs")) 
            {
                let numCivs = extractArgValue(args, "civs")
                if (numCivs === undefined) 
                {
                    sendBadlyFormedError(msg.channel)
                    return
                }
            }

            useVoice = !args.includes("novoice")
            let disableVanilla = args.includes("lekmod-only")
            useLekmod = args.includes("lekmod") || disableVanilla

            let voiceChannel = client.channels.cache.get(msg.member!.voice.channelID!) as VoiceChannel | undefined
            if (voiceChannel === undefined)
            {
                msg.channel.send("You're not in voice, so I'll set `novoice` on for this draft.")
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
