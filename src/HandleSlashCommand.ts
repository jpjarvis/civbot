import { CommandInteraction, GuildMember, VoiceChannel } from "discord.js"
import { CustomPromisify } from "util"
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
    const ai = interaction.options.getInteger("ai") ?? 0
    const civs = interaction.options.getInteger("civs") ?? 3
    const noVoice = interaction.options.getBoolean("no-voice") ?? false
    const civGroupString = interaction.options.getString("civ-groups")

    let civGroups: CivGroup[] = []
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
        "",
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

export async function handleSlashCommand(interaction: CommandInteraction) {
    if (interaction.commandName === "draft") {
        await handleDraft(interaction)
    }

    if (interaction.commandName === "config") {
        if (interaction.options.getSubcommand() === "show") {
            handleShowConfig(interaction)
        }
    }
}