import { Guild, Message, VoiceChannel } from "discord.js"
import { Client, Command, CommandMessage, Discord, On } from "@typeit/discord"
import { draft, PlayerDraft } from "./Draft.js"
import Messages from "./Messages.js"
import UserData from "./UserData.js"

type Civ5CivGroup = "civ5-vanilla" | "lekmod"
type Civ6CivGroup = "civ6-vanilla" | "civ6-rnf" | "civ6-gs" | "civ6-frontier" | "civ6-extra"
type CivGroup = Civ5CivGroup | Civ6CivGroup | "custom"

interface DraftArguments {
    numberOfAi: number,
    numberOfCivs: number,
    noVoice: boolean,
    civGroups: Set<CivGroup>
}

function extractArgValue(args: Array<string>, argName: string): number | undefined {
    let index = args.findIndex((a) => a === argName)

    if (index >= 0) {
        let result = parseInt(args[index + 1])
        if (isNaN(result)) {
            // Badly formed, so we give an error
            return undefined
        }

        return result
    }
}

function parseDraftArgs(args: string[]): {success: true, args: DraftArguments} | {success: false} {
    let ai = 0
    let numCivs = 3
    let noVoice = false
    let civGroups = new Set<CivGroup>()
    if (args.includes("ai")) {
        let aiArgValue = extractArgValue(args, "ai")
        if (aiArgValue === undefined) {
            return {success: false}
        }
        ai = aiArgValue
    }

    if (args.includes("civs")) {
        let numCivsArgValue = extractArgValue(args, "civs")
        if (numCivsArgValue === undefined) {
            return {success: false}
        }
        numCivs = numCivsArgValue
    }

    noVoice = args.includes("novoice")

    if (args.includes("civ6")) {
        civGroups.add("civ6-vanilla")
        let all = args.includes("all")
        if (all || args.includes("r&f")) {
            civGroups.add("civ6-rnf")
        }
        if (all || args.includes("gs")) {
            civGroups.add("civ6-gs")
        }
        if (all || args.includes("frontier")) {
            civGroups.add("civ6-frontier")
        }
        if (all || args.includes("extra")) {
            civGroups.add("civ6-extra")
        }
    }
    else if (args.includes("lekmod-only")) {
        civGroups.add("lekmod")
    }
    else if (args.includes("lekmod")) {
        civGroups.add("civ5-vanilla")
        civGroups.add("lekmod")
    }
    else {
        civGroups.add("civ5-vanilla")
    }

    return {success: true, args: {
        numberOfAi: ai,
        numberOfCivs: numCivs,
        noVoice: noVoice,
        civGroups: civGroups
    }}
}

function getPlayerDraftString(playerName: string, playerDraft: PlayerDraft): string {
    let response = `${playerName} `.padEnd(20, " ")
    for (let j = 0; j < playerDraft.length - 1; j++) {
        response += `${playerDraft[j]} / `
    }
    response += `${playerDraft[playerDraft.length - 1]}\n`
    return response
}

@Discord()
export abstract class CivBot {
    @On("ready")
    ready(): void {
        console.log("CivBot is alive!")
    }

    @Command("civbot")
    async onCommand(msg: CommandMessage, client: Client): Promise<void> {
        let args = msg.commandContent.split(" ")
        let serverId = msg.guild!.id

        const guild = await client.guilds.fetch(serverId)
        let bot = guild.member(client.user!)
        if (bot?.displayName === "Wesley") {
            msg.channel.send(Messages.Wowser)
        }

        // civbot
        if (args.length == 1) {
            msg.channel.send(Messages.Info)
        }

        // civbot help
        if (args[1] === 'help') {
            msg.channel.send(Messages.Help)
        }

        // civbot draft
        else if (args[1] === 'draft') {
            const parsedArgs = parseDraftArgs(args)
            if (!parsedArgs.success) {
                msg.channel.send(Messages.BadlyFormed)
                return
            }
            const { numberOfAi, numberOfCivs, noVoice, civGroups} = parsedArgs.args

            let voiceChannel = client.channels.cache.get(msg.member!.voice.channelID!) as VoiceChannel | undefined
            if (voiceChannel) {
                msg.channel.send(Messages.NotInVoice)
            }
            const useVoice = voiceChannel && !noVoice

            let voicePlayers = useVoice ? voiceChannel!.members.size : 0

            let loadCustomCivs: Promise<Array<string>> = (async (skip: boolean) => {
                if (skip) {
                    return []
                }
                const userData = await UserData.load(serverId)
                return userData.customCivs
            })(!args.includes("custom"))

            loadCustomCivs.then((customCivs: Array<string>) => {
                if (customCivs.length === 0 && args.includes("custom")) {
                    msg.channel.send(Messages.NoCustomCivs)
                }
                let draftResult = draft(voicePlayers + numberOfAi, numberOfCivs, civGroups, customCivs)
                let currentEntry = 0;
                let response = ""
                if (useVoice) {
                    voiceChannel!.members.forEach(function (member) {
                        response += getPlayerDraftString(member.user.username, draftResult[currentEntry])
                        currentEntry++
                    })
                }

                for (let i = 0; i < numberOfAi; i++) {
                    response += getPlayerDraftString(`AI ${i + 1}`, draftResult[currentEntry])
                    currentEntry++
                }

                if (response === "") {
                    msg.channel.send(Messages.DraftFailed)
                }
                else {
                    msg.channel.send("\`\`\`" + response + "\`\`\`")
                }
            })
        }

        else if (args[1] === 'civs') {
            if (args[2] === 'add') {
                let civsToAdd = args.slice(3)
                if (civsToAdd.length === 0) {
                    msg.channel.send(Messages.BadlyFormed)
                    return
                }
                UserData.load(serverId)
                    .then((userData: UserData) => {
                        userData.customCivs = userData.customCivs.concat(civsToAdd)
                        UserData.save(serverId, userData)
                    })
                    .then(() => {
                        msg.channel.send(Messages.AddedCustomCivs)
                    })
                    .catch((err) => {
                        msg.channel.send(Messages.GenericError)
                        console.log(err)
                    })
            }
            else if (args[2] === 'clear') {
                UserData.load(serverId)
                    .then((userData: UserData) => {
                        userData.customCivs = []
                        UserData.save(serverId, userData)
                    })
                    .then(() => {
                        msg.channel.send(Messages.ClearedCustomCivs)
                    })
                    .catch((err) => {
                        msg.channel.send(Messages.GenericError)
                        console.log(err)
                    })
            }
            else if (args[2] === 'show') {
                UserData.load(serverId)
                    .then((userData: UserData) => {
                        if (userData.customCivs.length === 0) {
                            msg.channel.send(Messages.NoCustomCivs)
                            return
                        }
                        msg.channel.send(`\`\`\`\n${userData.customCivs.join("\n")}\`\`\``)
                    })
                    .catch((err) => {
                        msg.channel.send(Messages.GenericError)
                        console.log(err)
                    })
            }

        }
    }
}