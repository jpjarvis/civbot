import {CommandInteraction, GuildMember, VoiceChannel} from "discord.js";
import {CivGroup, stringToCivGroup} from "./CivGroups";
import {getVoiceChannel} from "./DiscordUtils";
import {draftCommand} from "./DraftCommand";
import {UserDataStoreInstance} from "./UserDataStore";
import {DraftExecutor} from "./Draft";

function parseCivGroups(civGroupString: string): { success: true, civGroups: CivGroup[] } | { success: false, invalidGroups: string[] } {
    const strings = civGroupString.split(" ");
    const civGroups: CivGroup[] = [];
    const invalidGroups: string[] = [];

    strings.forEach(string => {
        const civGroup = stringToCivGroup(string);
        if (civGroup) {
            civGroups.push(civGroup);
        } else {
            invalidGroups.push(string);
        }
    });

    if (invalidGroups.length > 0) {
        return {
            success: false,
            invalidGroups: invalidGroups
        };
    }

    return {
        success: true,
        civGroups: civGroups
    };
}

async function handleDraft(interaction: CommandInteraction) {
    const serverId = interaction.guildId!;

    const ai = interaction.options.getInteger("ai") ?? undefined;
    const civs = interaction.options.getInteger("civs") ?? undefined;
    const noVoice = interaction.options.getBoolean("no-voice") ?? undefined;
    const civGroupString = interaction.options.getString("civ-groups") ?? undefined;

    let civGroups: CivGroup[] | undefined = undefined;
    if (civGroupString) {
        let parseResult = parseCivGroups(civGroupString);
        if (parseResult.success) {
            civGroups = parseResult.civGroups;
        } else {
            await interaction.reply(`Failed to parse civ-groups argument - the following are not valid civ groups: ${parseResult.invalidGroups}`);
            return;
        }
    }

    let response = "";
    let voiceChannel: VoiceChannel | undefined = undefined;
    const member = interaction.member;
    if (member instanceof GuildMember) {
        voiceChannel = await getVoiceChannel(interaction.client, member);
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
        new DraftExecutor(),
        (message) => {
            response += message + "\n";
        });

    await interaction.reply(response);
}

async function handleShowConfig(interaction: CommandInteraction) {
    const serverId = interaction.guildId!;

    const userData = await UserDataStoreInstance.load(serverId);

    let response = "";
    response += `Using civ groups: \`\`\`\n${userData.defaultDraftSettings?.civGroups?.join("\n")}\`\`\`` + "\n";
    if (userData.customCivs) {
        response += `Custom civs:\`\`\`\n${userData.customCivs.join("\n")}\`\`\``;
    }
    await interaction.reply(response);
}

async function handleEnableCivGroup(interaction: CommandInteraction) {
    const serverId = interaction.guildId!;

    const civGroup = stringToCivGroup(interaction.options.getString("civ-group")!)!;

    const userData = await UserDataStoreInstance.load(serverId);

    if (!userData.defaultDraftSettings.civGroups) {
        userData.defaultDraftSettings.civGroups = [];
    }

    if (userData.defaultDraftSettings.civGroups.includes(civGroup)) {
        await interaction.reply(`\`${civGroup}\` is already being used.`);
        return;
    }
    userData.defaultDraftSettings.civGroups.push(civGroup);
    await interaction.reply(`\`${civGroup}\` will now be used in your drafts.`);

    await UserDataStoreInstance.save(serverId, userData);
}

async function handleDisableCivGroup(interaction: CommandInteraction) {
    const serverId = interaction.guildId!;

    const civGroup = stringToCivGroup(interaction.options.getString("civ-group")!)!;

    const userData = await UserDataStoreInstance.load(serverId);

    if (!userData.defaultDraftSettings.civGroups) {
        userData.defaultDraftSettings.civGroups = [];
    }

    const toRemoveIndex = userData.defaultDraftSettings.civGroups.indexOf(civGroup);
    if (!userData.defaultDraftSettings.civGroups.includes(civGroup)) {
        await interaction.reply(`\`${civGroup}\` is not being used.`);
        return;
    }
    userData.defaultDraftSettings.civGroups.splice(toRemoveIndex, 1);
    await interaction.reply(`\`${civGroup}\` will no longer be used in your drafts.`);

    await UserDataStoreInstance.save(serverId, userData);
}

async function handleAddCustomCivs(interaction: CommandInteraction) {
    const serverId = interaction.guildId!;

    const userData = await UserDataStoreInstance.load(serverId);

    const civs = interaction.options.getString("civs")!.split(",").map(s => s.trim());
    userData.customCivs = userData.customCivs.concat(civs);
    await UserDataStoreInstance.save(serverId, userData);
    await interaction.reply(`Added ${civs.length} custom civs.`);
}

async function handleRemoveCustomCivs(interaction: CommandInteraction) {
    const serverId = interaction.guildId!;

    const userData = await UserDataStoreInstance.load(serverId);
    const originalNumberOfCivs = userData.customCivs.length;

    const civs = interaction.options.getString("civs")!.split(",").map(s => s.trim());
    
    const failedCivs = civs.filter(c => !userData.customCivs.includes(c));
    userData.customCivs = userData.customCivs.filter(c => !civs.includes(c))
    
    await UserDataStoreInstance.save(serverId, userData);
    
    let message: string = "";
    if (failedCivs.length > 0) {
        message += `Civ(s) \`${failedCivs.join(", ")}\` not found.\n`;
    }
    message += `Removed ${originalNumberOfCivs - userData.customCivs.length} custom civ(s).`
    await interaction.reply(message);
}

async function handleClearCustomCivs(interaction: CommandInteraction) {
    const serverId = interaction.guildId!;

    const userData = await UserDataStoreInstance.load(serverId);
    userData.customCivs = [];
    await UserDataStoreInstance.save(serverId, userData);
    await interaction.reply("All custom civs deleted.");
}

export async function handleSlashCommand(interaction: CommandInteraction) {
    if (interaction.commandName === "draft") {
        await handleDraft(interaction);
        return;
    }

    if (interaction.commandName === "config") {
        if (interaction.options.getSubcommand() === "show") {
            await handleShowConfig(interaction);
            return;
        }

        if (interaction.options.getSubcommandGroup() === "civ-groups") {
            const subcommand = interaction.options.data[0].options![0].name;

            if (subcommand === "enable") {
                await handleEnableCivGroup(interaction);
                return;
            }

            if (subcommand === "disable") {
                await handleDisableCivGroup(interaction);
                return;
            }
        }

        if (interaction.options.getSubcommandGroup() === "civs") {
            const subcommand = interaction.options.data[0].options![0].name;

            if (subcommand === "add") {
                await handleAddCustomCivs(interaction);
                return;
            }

            if (subcommand === "remove") {
                await handleRemoveCustomCivs(interaction);
                return;
            }
            
            if (subcommand === "clear") {
                await handleClearCustomCivs(interaction);
                return;
            }
        }
    }


}