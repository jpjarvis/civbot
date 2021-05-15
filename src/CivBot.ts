import { Guild, VoiceChannel } from "discord.js"
import { Client, Command, CommandMessage, Discord, On } from "@typeit/discord"
import { draft, PlayerDraft } from "./Draft.js"
import Messages from "./Messages.js"

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

@Discord()
export abstract class CivBot {
    @On("ready")
    ready(): void {
        console.log("CivBot is alive!")
    }

    @Command("civbot")
    onCommand(msg: CommandMessage, client: Client ): void {
        let args = msg.commandContent.split(" ")

        client.guilds.fetch(msg.guild!.id).then((guild: Guild) => {
            let bot = guild.member(client.user!)
            if (bot?.displayName === "Wesley") {
                msg.channel.send(Messages.Wowser)
            }
        })

        // civbot
        if (args.length == 1) 
        {
            msg.channel.send(Messages.Info)
        }

        // civbot help
        if (args[1] === 'help')
        {
            msg.channel.send(Messages.Help)
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
                let aiArgValue = extractArgValue(args, "ai")
                if (aiArgValue === undefined) 
                {
                    msg.channel.send(Messages.BadlyFormed)
                    return
                }
                ai = aiArgValue
            }

            if (args.includes("civs")) 
            {
                let numCivsArgValue = extractArgValue(args, "civs")
                if (numCivsArgValue === undefined) 
                {
                    msg.channel.send(Messages.BadlyFormed)
                    return
                }
                numCivs = numCivsArgValue
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
    }
}