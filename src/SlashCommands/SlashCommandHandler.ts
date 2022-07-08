import {CommandInteraction} from "discord.js";
import {CivGroup, stringToCivGroup} from "../Types/CivGroups";
import {getVoiceChannelMembers} from "../DiscordUtils";
import {DraftArguments, draftCommand} from "../Commands/Draft/DraftCommand";
import {UserDataStore} from "../UserDataStore/UserDataStore";
import {ResultOrErrorWithDetails} from "../Types/ResultOrError";
import {generateDraftCommandOutputMessage} from "../Commands/Draft/DraftCommandMessages";
import {showConfigCommand} from "../Commands/Config/ShowConfigCommand";
import {enableCivGroupCommand} from "../Commands/CivGroups/EnableCivGroupCommand";
import {disableCivGroupCommand} from "../Commands/CivGroups/DisableCivGroupCommand";
import {addCustomCivsCommand} from "../Commands/CustomCivs/AddCustomCivsCommand";
import {removeCustomCivsCommand} from "../Commands/CustomCivs/RemoveCustomCivsCommand";
import {clearCustomCivsCommand} from "../Commands/CustomCivs/ClearCustomCivsCommand";
import {loadProfileCommand} from "../Commands/Profiles/LoadProfileCommand";
import {saveProfileCommand} from "../Commands/Profiles/SaveProfileCommand";
import {showProfilesCommand} from "../Commands/Profiles/ShowProfilesCommand";

function parseCivGroups(civGroupString: string): ResultOrErrorWithDetails<CivGroup[], { invalidGroups: string[] }> {
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
            isError: true,
            error: {
                invalidGroups: invalidGroups
            }
        };
    }

    return {
        isError: false,
        result: civGroups
    };
}

function extractCustomCivsArgument(interaction: CommandInteraction): string[] {
    return interaction.options.getString("civs")!.split(",").map(s => s.trim());
}

function extractDraftArguments(interaction: CommandInteraction): ResultOrErrorWithDetails<Partial<DraftArguments>, string> {
    const ai = interaction.options.getInteger("ai") ?? undefined;
    const civs = interaction.options.getInteger("civs") ?? undefined;
    const civGroupString = interaction.options.getString("civ-groups") ?? undefined;

    let civGroups: CivGroup[] | undefined = undefined;
    if (civGroupString) {
        let parseResult = parseCivGroups(civGroupString);
        if (!parseResult.isError) {
            civGroups = parseResult.result;
        } else {
            return {
                isError: true,
                error: `Failed to parse civ-groups argument - the following are not valid civ groups: ${parseResult.error.invalidGroups}`
            };
        }
    }

    return {
        isError: false,
        result: {
            numberOfCivs: civs,
            numberOfAi: ai,
            civGroups: civGroups
        }
    };
}

export default class SlashCommandHandler {
    private readonly userDataStore: UserDataStore;

    constructor(userDataStore: UserDataStore) {
        this.userDataStore = userDataStore;
    }

    private async handleDraft(interaction: CommandInteraction) {

        const serverId = interaction.guildId!;

        const draftArgumentsOrError = extractDraftArguments(interaction);

        if (draftArgumentsOrError.isError) {
            await interaction.reply(draftArgumentsOrError.error);
            return;
        }

        const voiceChannelMembers = await getVoiceChannelMembers(interaction);

        const response = draftCommand(
            draftArgumentsOrError.result,
            voiceChannelMembers,
            (await this.userDataStore.load(serverId)).activeUserSettings);

        await interaction.reply(generateDraftCommandOutputMessage(response));
    }

    private async handleShowConfig(interaction: CommandInteraction) {
        const serverId = interaction.guildId!;
        const userSettings = (await this.userDataStore.load(serverId)).activeUserSettings;

        let response = showConfigCommand(userSettings);
        await interaction.reply(response);
    }

    private async handleEnableCivGroup(interaction: CommandInteraction) {
        const serverId = interaction.guildId!;
        const civGroup = stringToCivGroup(interaction.options.getString("civ-group")!)!;

        const message = await enableCivGroupCommand(this.userDataStore, serverId, civGroup);
        await interaction.reply(message);
    }

    private async handleDisableCivGroup(interaction: CommandInteraction) {
        const serverId = interaction.guildId!;
        const civGroup = stringToCivGroup(interaction.options.getString("civ-group")!)!;

        const message = await disableCivGroupCommand(this.userDataStore, serverId, civGroup);
        await interaction.reply(message);
    }

    private async handleAddCustomCivs(interaction: CommandInteraction) {
        const serverId = interaction.guildId!;
        const civs = extractCustomCivsArgument(interaction);

        const message = await addCustomCivsCommand(this.userDataStore, serverId, civs);
        await interaction.reply(message);
    }

    private async handleRemoveCustomCivs(interaction: CommandInteraction) {
        const serverId = interaction.guildId!;
        const civs = extractCustomCivsArgument(interaction);

        const message = await removeCustomCivsCommand(this.userDataStore, serverId, civs);
        await interaction.reply(message);
    }

    private async handleClearCustomCivs(interaction: CommandInteraction) {
        const serverId = interaction.guildId!;

        const message = await clearCustomCivsCommand(this.userDataStore, serverId);
        await interaction.reply(message);
    }

    private async handleLoadProfile(interaction: CommandInteraction) {
        const serverId = interaction.guildId!;

        const profileToLoad = interaction.options.getString("profile-name")!;

        const message = await loadProfileCommand(this.userDataStore, serverId, profileToLoad);
        await interaction.reply(message);
    }

    private async handleSaveProfile(interaction: CommandInteraction) {
        const serverId = interaction.guildId!;

        const profileToLoad = interaction.options.getString("profile-name")!;

        const message = await saveProfileCommand(this.userDataStore, serverId, profileToLoad);
        await interaction.reply(message);
    }

    private async handleShowProfiles(interaction: CommandInteraction) {
        const serverId = interaction.guildId!;
        const userData = await this.userDataStore.load(serverId);
        
        const message = await showProfilesCommand(userData);

        await interaction.reply(message);
    }

    async handle(interaction: CommandInteraction) {
        if (interaction.commandName === "draft") {
            await this.handleDraft(interaction);
            return;
        }

        if (interaction.commandName === "config") {
            await this.handleShowConfig(interaction);
            return;
        }

        if (interaction.commandName === "civ-groups") {
            const subcommand = interaction.options.getSubcommand();

            if (subcommand === "enable") {
                await this.handleEnableCivGroup(interaction);
                return;
            }

            if (subcommand === "disable") {
                await this.handleDisableCivGroup(interaction);
                return;
            }
        }

        if (interaction.commandName === "civs") {
            const subcommand = interaction.options.getSubcommand();

            if (subcommand === "add") {
                await this.handleAddCustomCivs(interaction);
                return;
            }

            if (subcommand === "remove") {
                await this.handleRemoveCustomCivs(interaction);
                return;
            }

            if (subcommand === "clear") {
                await this.handleClearCustomCivs(interaction);
                return;
            }
        }

        if (interaction.commandName === "profiles") {
            const subcommand = interaction.options.getSubcommand();

            if (subcommand === "load") {
                await this.handleLoadProfile(interaction);
                return;
            }

            if (subcommand === "save") {
                await this.handleSaveProfile(interaction);
                return;
            }

            if (subcommand === "show") {
                await this.handleShowProfiles(interaction);
                return;
            }
        }

        await interaction.reply("Sorry, I don't recognise that command. This is probably a bug.");
    }
}