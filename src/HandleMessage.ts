import Messages from "./Messages.js"
import UserData from "./UserData.js"
import { CivGroup } from "./CivGroups.js"
import { getVoiceChannel } from "./DiscordUtils.js"
import { DraftArguments, draftCommand } from "./DraftCommand.js"
import { Client, Message } from "discord.js"
import { draft } from "./Draft.js"

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

function parseDraftArgs(args: string[]): {success: true, args: Partial<DraftArguments>} | {success: false} {
    let draftArgs: Partial<DraftArguments> = {}

    if (args.includes("ai")) {
        let aiArgValue = extractArgValue(args, "ai")
        if (aiArgValue === undefined) {
            return {success: false}
        }
        draftArgs.numberOfAi = aiArgValue
    }

    if (args.includes("civs")) {
        let numCivsArgValue = extractArgValue(args, "civs")
        if (numCivsArgValue === undefined) {
            return {success: false}
        }
        draftArgs.numberOfCivs = numCivsArgValue
    }

    draftArgs.noVoice = args.includes("novoice")

    const civGroupsSpecified: CivGroup[] = []
    if (args.includes("civ6")) {
        civGroupsSpecified.push("civ6-vanilla")
        let all = args.includes("all")
        if (all || args.includes("r&f")) {
            civGroupsSpecified.push("civ6-rnf")
        }
        if (all || args.includes("gs")) {
            civGroupsSpecified.push("civ6-gs")
        }
        if (all || args.includes("frontier")) {
            civGroupsSpecified.push("civ6-frontier")
        }
        if (all || args.includes("extra")) {
            civGroupsSpecified.push("civ6-extra")
        }
    }
    else if (args.includes("lekmod-only")) {
        civGroupsSpecified.push("lekmod")
    }
    else if (args.includes("lekmod")) {
        civGroupsSpecified.push("civ5-vanilla")
        civGroupsSpecified.push("lekmod")
    }
    else {
        civGroupsSpecified.push("civ5-vanilla")
    }

    if (civGroupsSpecified.length > 0) {
        draftArgs.civGroups = civGroupsSpecified
    }

    return {success: true, args: draftArgs}
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