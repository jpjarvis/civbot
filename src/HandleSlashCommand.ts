import { CommandInteraction, GuildMember, VoiceChannel } from "discord.js"
import { CivGroup, stringToCivGroup } from "./CivGroups"
import { getVoiceChannel } from "./DiscordUtils"
import { draftCommand } from "./DraftCommand"
import Messages from "./Messages"
import UserData from "./UserData"

function parseCivGroups(civGroupString: string): {success: true, civGroups: CivGroup[]} | {success: false, invalidGroups: string[]} {
    const strings = civGroupString.split(" ")
    const civGroups: CivGroup[] = []
    const invalidGroups: string[] = []

    strings.forEach(string => {
        const civGroup = stringToCivGroup(string)
        if (civGroup) {
            civGroups.push(civGroup)
        }
        else {
            invalidGroups.push(string)
        }
    });

    if (invalidGroups.length > 0) {
        return {
            success: false,
            invalidGroups: invalidGroups
        }
    }
    
    return {
        success: true,
        civGroups: civGroups
    }
}

async function handleDraft(interaction: CommandInteraction) {
    const serverId = interaction.guildId
    if (!serverId) {
        interaction.reply(Messages.GenericError)
        return
    }

    const ai = interaction.options.getInteger("ai") ?? undefined
    const civs = interaction.options.getInteger("civs") ?? undefined
    const noVoice = interaction.options.getBoolean("no-voice") ?? undefined
    const civGroupString = interaction.options.getString("civ-groups") ?? undefined

    let civGroups: CivGroup[] | undefined = undefined
    if (civGroupString) {
        let parseResult = parseCivGroups(civGroupString)
        if (parseResult.success) {
            civGroups = parseResult.civGroups
        }
        else {
            interaction.reply(`Failed to parse civ-groups argument - the following are not valid civ groups: ${parseResult.invalidGroups}`)
            return
        }
    }

    let response = ""
    let voiceChannel: VoiceChannel | undefined = undefined
    const member = interaction.member
    if (member instanceof GuildMember) {
        voiceChannel = await getVoiceChannel(interaction.client, member)
    }

    await draftCommand(
        {
            numberOfCivs: civs,
            numberOfAi: ai,
            noVoice: noVoice,
            civGroups: civGroups
        },
        voiceChannel,
        serverId,
        (message) => { response += message + "\n" })

    interaction.reply(response)
}

async function handleShowConfig(interaction: CommandInteraction) {
    const serverId = interaction.guildId
    if (!serverId) {
        interaction.reply(Messages.GenericError)
        return
    }

    const userData = await UserData.load(serverId)

    let response = ""
    response += `Using civ groups: \`\`\`${userData.defaultDraftSettings?.civGroups?.join("\n")}\`\`\`` + "\n"
    if (userData.customCivs) {
        response += `Custom civs:\`\`\`\n${userData.customCivs.join("\n")}\`\`\``
    }
    interaction.reply(response)
}

async function handleEnableCivGroup(interaction: CommandInteraction) {
    const serverId = interaction.guildId
    if (!serverId) {
        interaction.reply(Messages.GenericError)
        return
    }

    const civGroup = stringToCivGroup(interaction.options.getString("civ-group")!)!

    const userData = await UserData.load(serverId)

    if (!userData.defaultDraftSettings.civGroups) {
        userData.defaultDraftSettings.civGroups = []
    }

    if (userData.defaultDraftSettings.civGroups.includes(civGroup)) {
        interaction.reply(`\`${civGroup}\` is already being used.`)
        return
    }
    userData.defaultDraftSettings.civGroups.push(civGroup)
    interaction.reply(`\`${civGroup}\` will now be used in your drafts.`)

    await UserData.save(serverId, userData)
}

async function handleDisableCivGroup(interaction: CommandInteraction) {
    const serverId = interaction.guildId
    if (!serverId) {
        interaction.reply(Messages.GenericError)
        return
    }

    const civGroup = stringToCivGroup(interaction.options.getString("civ-group")!)!

    const userData = await UserData.load(serverId)

    if (!userData.defaultDraftSettings.civGroups) {
        userData.defaultDraftSettings.civGroups = []
    }

    const toRemoveIndex = userData.defaultDraftSettings.civGroups.indexOf(civGroup)
    if (!userData.defaultDraftSettings.civGroups.includes(civGroup)) {
        interaction.reply(`\`${civGroup}\` is not being used.`)
        return
    }
    userData.defaultDraftSettings.civGroups.splice(toRemoveIndex, 1)
    interaction.reply(`\`${civGroup}\` will no longer be used in your drafts.`)

    await UserData.save(serverId, userData)
}

export async function handleSlashCommand(interaction: CommandInteraction) {
    if (interaction.commandName === "draft") {
        await handleDraft(interaction)
        return
    }

    if (interaction.commandName === "config") {
        if (interaction.options.getSubcommand() === "show") {
            handleShowConfig(interaction)
            return
        }

        if (interaction.options.getSubcommandGroup() === "civ-groups") {
            const subcommand = interaction.options.data[0].options![0].name

            if (subcommand === "enable") {
                handleEnableCivGroup(interaction)
                return
            }
            
            if (subcommand === "disable") {
                handleDisableCivGroup(interaction)
                return
            }
        }
    }
}