import {ChatInputCommandInteraction} from "discord.js";
import {Expansion, stringToExpansion} from "../../Civs/Expansions";
import {getVoiceChannelMembers} from "../VoiceChannels";
import {DraftArguments, draftCommand} from "../../Commands/Draft/DraftCommand";
import {Result} from "../../Functional/Result";
import {showConfigCommand} from "../../Commands/Config/ShowConfigCommand";
import {enableExpansionCommand} from "../../Commands/Expansions/EnableExpansionCommand";
import {disableExpansionCommand} from "../../Commands/Expansions/DisableExpansionCommand";
import {loadUserData} from "../../UserDataStore";
import {handleBan} from "../../Commands/Ban/BanCommand";
import {handleUnban} from "../../Commands/Ban/UnbanCommand";
import {logError, logInfo} from "../../Log";
import {switchGameCommand} from "../../Commands/SwitchGame/SwitchGameCommand";
import {updateSlashCommandsForServer} from "./UpdateSlashCommands";
import {customCivsModal} from "../Modals/CustomCivsModal";

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

    if (interaction.commandName === "expansions") {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === "enable") {
            await handleEnableExpansion(interaction);
            return;
        }

        if (subcommand === "disable") {
            await handleDisableExpansion(interaction);
            return;
        }
    }

    if (interaction.commandName === "custom-civs") {
        await handleCustomCivs(interaction);
        return;
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

function parseExpansions(expansionsString: string): Result<Expansion[], { invalidExpansions: string[] }> {
    const strings = expansionsString.split(" ");
    const expansions: Expansion[] = [];
    const invalidExpansions: string[] = [];

    strings.forEach((string) => {
        const expansion = stringToExpansion(string);
        if (expansion) {
            expansions.push(expansion);
        } else {
            invalidExpansions.push(string);
        }
    });

    if (invalidExpansions.length > 0) {
        return {
            isError: true,
            error: {
                invalidExpansions: invalidExpansions,
            },
        };
    }

    return {
        isError: false,
        value: expansions,
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
    const expansionsString = interaction.options.getString("expansions") ?? undefined;

    let expansions: Expansion[] | undefined = undefined;
    if (expansionsString) {
        let parseResult = parseExpansions(expansionsString);
        if (!parseResult.isError) {
            expansions = parseResult.value;
        } else {
            return {
                isError: true,
                error: `Failed to parse expansions argument - the following are not valid expansions: ${parseResult.error.invalidExpansions}`,
            };
        }
    }

    return {
        isError: false,
        value: {
            numberOfCivs: civs,
            numberOfAi: ai,
            expansions: expansions,
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
    let response = showConfigCommand(await loadUserData(serverId));
    await interaction.reply(response);
}

async function handleEnableExpansion(interaction: ChatInputCommandInteraction) {
    const serverId = interaction.guildId!;
    const expansion = stringToExpansion(interaction.options.getString("expansion")!)!;

    const message = await enableExpansionCommand(serverId, expansion);
    await interaction.reply(message);
}

async function handleDisableExpansion(interaction: ChatInputCommandInteraction) {
    const serverId = interaction.guildId!;
    const expansion = stringToExpansion(interaction.options.getString("expansion")!)!;

    const message = await disableExpansionCommand(serverId, expansion);
    await interaction.reply(message);
}

async function handleCustomCivs(interaction: ChatInputCommandInteraction) {
    const serverId = interaction.guildId!;
    const userData = await loadUserData(serverId);

    await interaction.showModal(customCivsModal(userData.userSettings[userData.game].customCivs));
}

async function handleSwitchGame(interaction: ChatInputCommandInteraction) {
    const serverId = interaction.guildId!;

    const game = await switchGameCommand(serverId);

    await updateSlashCommandsForServer(interaction.client, serverId);

    await interaction.reply(`Switched to drafting for ${game}.`);
}
