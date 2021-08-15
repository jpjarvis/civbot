import Messages from "./Messages.js"
import UserData from "./UserData.js"
import { CivGroup } from "./CivGroups.js"
import { getVoiceChannel } from "./DiscordUtils.js"
import { DraftArguments, draftCommand } from "./DraftCommand.js"
import { Client, CommandInteraction, Message } from "discord.js"

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
    let civGroups: CivGroup[] = []
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
        civGroups.push("civ6-vanilla")
        let all = args.includes("all")
        if (all || args.includes("r&f")) {
            civGroups.push("civ6-rnf")
        }
        if (all || args.includes("gs")) {
            civGroups.push("civ6-gs")
        }
        if (all || args.includes("frontier")) {
            civGroups.push("civ6-frontier")
        }
        if (all || args.includes("extra")) {
            civGroups.push("civ6-extra")
        }
    }
    else if (args.includes("lekmod-only")) {
        civGroups.push("lekmod")
    }
    else if (args.includes("lekmod")) {
        civGroups.push("civ5-vanilla")
        civGroups.push("lekmod")
    }
    else {
        civGroups.push("civ5-vanilla")
    }

    return {success: true, args: {
        numberOfAi: ai,
        numberOfCivs: numCivs,
        noVoice: noVoice,
        civGroups: civGroups
    }}
}

class CivBot {
    ready(): void {
        console.log("CivBot is alive!")
    }
}

export async function handleMessage(msg: Message, client: Client): Promise<void> {
    if (!msg.content.startsWith("civbot")) {
        return
    }

    let args = msg.content.split(" ")
    let serverId = msg.guild!.id

    const guild = await client.guilds.fetch(serverId)
    let bot = await guild.members.fetch(client.user!)
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
        await draftCommand(parsedArgs.args, await getVoiceChannel(client, msg.member!), serverId, (message) => msg.channel.send(message))
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