import {ChatInputCommandInteraction, CommandInteraction} from "discord.js";
import { CivGroup, stringToCivGroup } from "../../Civs/CivGroups";
import { getVoiceChannelMembers } from "../VoiceChannels";
import { DraftArguments, draftCommand } from "../../Commands/Draft/DraftCommand";
import { Result } from "../../Functional/Result";
import { showConfigCommand } from "../../Commands/Config/ShowConfigCommand";
import { enableCivGroupCommand } from "../../Commands/CivGroups/EnableCivGroupCommand";
import { disableCivGroupCommand } from "../../Commands/CivGroups/DisableCivGroupCommand";
import { addCustomCivsCommand } from "../../Commands/CustomCivs/AddCustomCivsCommand";
import { removeCustomCivsCommand } from "../../Commands/CustomCivs/RemoveCustomCivsCommand";
import { clearCustomCivsCommand } from "../../Commands/CustomCivs/ClearCustomCivsCommand";
import { loadProfileCommand } from "../../Commands/Profiles/LoadProfileCommand";
import { saveProfileCommand } from "../../Commands/Profiles/SaveProfileCommand";
import { showProfilesCommand } from "../../Commands/Profiles/ShowProfilesCommand";
import { loadUserData } from "../../UserDataStore";
import { banCommand } from "../../Commands/Ban/BanCommand";
import { unbanCommand } from "../../Commands/Ban/UnbanCommand";
import {logError, logInfo} from "../../Log";
import {switchGameCommand} from "../../Commands/SwitchGame/SwitchGameCommand";
import {updateSlashCommandsForServer} from "./UpdateSlashCommands";

export async function handleSlashCommand(interaction: ChatInputCommandInteraction) {
    logInfo(`Received interaction "${interaction.commandName}" with parameters { ${interaction.options.data.map(x => `${x.name}: ${x.value}`).join(", ")} }`);
    
    if (interaction.commandName === "draft") {
        await handleDraft(interaction);
        return;
    }

    if (interaction.commandName === "config") {
        await handleShowConfig(interaction);
        return;
    }

    if (interaction.commandName === "civ-groups") {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === "enable") {
            await handleEnableCivGroup(interaction);
            return;
        }

        if (subcommand === "disable") {
            await handleDisableCivGroup(interaction);
            return;
        }
    }

    if (interaction.commandName === "civs") {
        const subcommand = interaction.options.getSubcommand();

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

    if (interaction.commandName === "profiles") {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === "load") {
            await handleLoadProfile(interaction);
            return;
        }

        if (subcommand === "save") {
            await handleSaveProfile(interaction);
            return;
        }

        if (subcommand === "show") {
            await handleShowProfiles(interaction);
            return;
        }
    }

    if (interaction.commandName === "ban") {
        await handleBan(interaction);
        return;
    }

    if (interaction.commandName === "unban") {
        await handleUnban(interaction);
        return;
    }
    
    if (interaction.commandName === "switch-game") {
        await handleSwitchGame(interaction);
        return;
    }
    
    logError(`Unrecognised slash command ${interaction.commandName}.`);
    await interaction.reply("Sorry, I don't recognise that command. This is probably a bug.");
}

function parseCivGroups(civGroupString: string): Result<CivGroup[], { invalidGroups: string[] }> {
    const strings = civGroupString.split(" ");
    const civGroups: CivGroup[] = [];
    const invalidGroups: string[] = [];

    strings.forEach((string) => {
        const civGroup = stringToCivGroup(string);
        if (civGroup) {
            civGroups.push(civGroup);
        } else {
            invalidGroups.push(string);
        }
    });

    if (invalidGroups.length > 0) {
        return {
            isError: true,
            error: {
                invalidGroups: invalidGroups,
            },
        };
    }

    return {
        isError: false,
        value: civGroups,
    };
}

function extractCustomCivsArgument(interaction: ChatInputCommandInteraction): string[] {
    return interaction.options
        .getString("civs")!
        .split(",")
        .map((s) => s.trim());
}

function extractDraftArguments(interaction: ChatInputCommandInteraction): Result<Partial<DraftArguments>, string> {
    const ai = interaction.options.getInteger("ai") ?? undefined;
    const civs = interaction.options.getInteger("civs") ?? undefined;
    const civGroupString = interaction.options.getString("civ-groups") ?? undefined;

    let civGroups: CivGroup[] | undefined = undefined;
    if (civGroupString) {
        let parseResult = parseCivGroups(civGroupString);
        if (!parseResult.isError) {
            civGroups = parseResult.value;
        } else {
            return {
                isError: true,
                error: `Failed to parse civ-groups argument - the following are not valid civ groups: ${parseResult.error.invalidGroups}`,
            };
        }
    }

    return {
        isError: false,
        value: {
            numberOfCivs: civs,
            numberOfAi: ai,
            civGroups: civGroups,
        },
    };
}

async function handleDraft(interaction: ChatInputCommandInteraction) {
    const serverId = interaction.guildId!;

    const draftArgumentsOrError = extractDraftArguments(interaction);

    if (draftArgumentsOrError.isError) {
        await interaction.reply(draftArgumentsOrError.error);
        return;
    }

    const voiceChannelMembers = await getVoiceChannelMembers(interaction);

    const userData = await loadUserData(serverId)
    const response = draftCommand(
        draftArgumentsOrError.value,
        voiceChannelMembers,
        userData.userSettings[userData.game]
    );

    await interaction.reply(response);
}

async function handleShowConfig(interaction: ChatInputCommandInteraction) {
    const serverId = interaction.guildId!;
    const userData = await loadUserData(serverId);
    const userSettings = userData.userSettings[userData.game];

    let response = showConfigCommand(userSettings);
    await interaction.reply(response);
}

async function handleEnableCivGroup(interaction: ChatInputCommandInteraction) {
    const serverId = interaction.guildId!;
    const civGroup = stringToCivGroup(interaction.options.getString("civ-group")!)!;

    const message = await enableCivGroupCommand(serverId, civGroup);
    await interaction.reply(message);
}

async function handleDisableCivGroup(interaction: ChatInputCommandInteraction) {
    const serverId = interaction.guildId!;
    const civGroup = stringToCivGroup(interaction.options.getString("civ-group")!)!;

    const message = await disableCivGroupCommand(serverId, civGroup);
    await interaction.reply(message);
}

async function handleAddCustomCivs(interaction: ChatInputCommandInteraction) {
    const serverId = interaction.guildId!;
    const civs = extractCustomCivsArgument(interaction);

    const message = await addCustomCivsCommand(serverId, civs);
    await interaction.reply(message);
}

async function handleRemoveCustomCivs(interaction: ChatInputCommandInteraction) {
    const serverId = interaction.guildId!;
    const civs = extractCustomCivsArgument(interaction);

    const message = await removeCustomCivsCommand(serverId, civs);
    await interaction.reply(message);
}

async function handleClearCustomCivs(interaction: ChatInputCommandInteraction) {
    const serverId = interaction.guildId!;

    const message = await clearCustomCivsCommand(serverId);
    await interaction.reply(message);
}

async function handleLoadProfile(interaction: ChatInputCommandInteraction) {
    const serverId = interaction.guildId!;

    const profileToLoad = interaction.options.getString("profile-name")!;

    const message = await loadProfileCommand(serverId, profileToLoad);
    await interaction.reply(message);
}

async function handleSaveProfile(interaction: ChatInputCommandInteraction) {
    const serverId = interaction.guildId!;

    const profileToLoad = interaction.options.getString("profile-name")!;

    const message = await saveProfileCommand(serverId, profileToLoad);
    await interaction.reply(message);
}

async function handleShowProfiles(interaction: ChatInputCommandInteraction) {
    const serverId = interaction.guildId!;
    const userData = await loadUserData(serverId);

    const message = await showProfilesCommand(userData);

    await interaction.reply(message);
}

async function handleBan(interaction: ChatInputCommandInteraction) {
    const serverId = interaction.guildId!;

    const civToBan = interaction.options.getString("civ")!;
    const message = await banCommand(serverId, civToBan);

    await interaction.reply(message);
}

async function handleUnban(interaction: ChatInputCommandInteraction) {
    const serverId = interaction.guildId!;

    const civToUnban = interaction.options.getString("civ")!;
    const message = await unbanCommand(serverId, civToUnban);

    await interaction.reply(message);
}

async function handleSwitchGame(interaction: ChatInputCommandInteraction) {
    const serverId = interaction.guildId!;
    
    const game = await switchGameCommand(serverId);

    await updateSlashCommandsForServer(interaction.client, serverId);
    
    await interaction.reply(`Switched to drafting for ${game}.`);
}
