import {CommandInteraction} from "discord.js";
import {CivGroup, stringToCivGroup} from "../../Draft/Types/CivGroups";
import {getVoiceChannelMembers} from "../DiscordUtils";
import {DraftArguments, draftCommand} from "../DraftCommand";
import {UserDataStore} from "../UserDataStore/UserDataStore";
import {ResultOrError} from "../../Draft/Types/ResultOrError";
import loadCivDataFromFile from "../../Draft/JsonCivDataAccessor";

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

export default class SlashCommandHandler {
    private readonly userDataStore: UserDataStore;
    
    constructor(userDataStore: UserDataStore) {
        this.userDataStore = userDataStore
    }

    private static extractDraftArguments(interaction: CommandInteraction): ResultOrError<Partial<DraftArguments>, string> {
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
                return {isError: true, error: `Failed to parse civ-groups argument - the following are not valid civ groups: ${parseResult.invalidGroups}`};
            }
        }

        return {
            isError: false,
            result: {
                numberOfCivs: civs,
                numberOfAi: ai,
                noVoice: noVoice,
                civGroups: civGroups
            }
        }
    }
    
    private async handleDraft(interaction: CommandInteraction) {
        
        const serverId = interaction.guildId!;

        let response = "";
        
        const draftArgumentsOrError = SlashCommandHandler.extractDraftArguments(interaction);
        
        if (draftArgumentsOrError.isError) {
            await interaction.reply(draftArgumentsOrError.error);
            return;
        }
        
        const voiceChannelMembers = await getVoiceChannelMembers(interaction);

        await draftCommand(
            draftArgumentsOrError.result,
            voiceChannelMembers,
            (message) => {
                response += message + "\n";
            },
            await this.userDataStore.load(serverId),
            loadCivDataFromFile("civs.json"));

        await interaction.reply(response);
    }

    private async handleShowConfig(interaction: CommandInteraction) {
        const serverId = interaction.guildId!;

        const userData = await this.userDataStore.load(serverId);

        let response = "";
        response += `Using civ groups: \`\`\`\n${userData.defaultDraftSettings?.civGroups?.join("\n")}\`\`\`` + "\n";
        if (userData.customCivs) {
            response += `Custom civs:\`\`\`\n${userData.customCivs.join("\n")}\`\`\``;
        }
        await interaction.reply(response);
    }

    private async handleEnableCivGroup(interaction: CommandInteraction) {
        const serverId = interaction.guildId!;

        const civGroup = stringToCivGroup(interaction.options.getString("civ-group")!)!;

        const userData = await this.userDataStore.load(serverId);

        if (!userData.defaultDraftSettings.civGroups) {
            userData.defaultDraftSettings.civGroups = [];
        }

        if (userData.defaultDraftSettings.civGroups.includes(civGroup)) {
            await interaction.reply(`\`${civGroup}\` is already being used.`);
            return;
        }
        userData.defaultDraftSettings.civGroups.push(civGroup);
        await interaction.reply(`\`${civGroup}\` will now be used in your drafts.`);

        await this.userDataStore.save(serverId, userData);
    }

    private async handleDisableCivGroup(interaction: CommandInteraction) {
        const serverId = interaction.guildId!;

        const civGroup = stringToCivGroup(interaction.options.getString("civ-group")!)!;

        const userData = await this.userDataStore.load(serverId);

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

        await this.userDataStore.save(serverId, userData);
    }

    private async handleAddCustomCivs(interaction: CommandInteraction) {
        const serverId = interaction.guildId!;

        const userData = await this.userDataStore.load(serverId);

        const civs = interaction.options.getString("civs")!.split(",").map(s => s.trim());
        userData.customCivs = userData.customCivs.concat(civs);
        await this.userDataStore.save(serverId, userData);
        await interaction.reply(`Added ${civs.length} custom civs.`);
    }

    private async handleRemoveCustomCivs(interaction: CommandInteraction) {
        const serverId = interaction.guildId!;

        const userData = await this.userDataStore.load(serverId);
        const originalNumberOfCivs = userData.customCivs.length;

        const civs = interaction.options.getString("civs")!.split(",").map(s => s.trim());

        const failedCivs = civs.filter(c => !userData.customCivs.includes(c));
        userData.customCivs = userData.customCivs.filter(c => !civs.includes(c))

        await this.userDataStore.save(serverId, userData);

        let message: string = "";
        if (failedCivs.length > 0) {
            message += `Civ(s) \`${failedCivs.join(", ")}\` not found.\n`;
        }
        message += `Removed ${originalNumberOfCivs - userData.customCivs.length} custom civ(s).`
        await interaction.reply(message);
    }
    
    private async handleClearCustomCivs(interaction: CommandInteraction) {
        const serverId = interaction.guildId!;

        const userData = await this.userDataStore.load(serverId);
        userData.customCivs = [];
        await this.userDataStore.save(serverId, userData);
        await interaction.reply("All custom civs deleted.");
    }
    
    async handle(interaction: CommandInteraction) {
        if (interaction.commandName === "draft") {
            await this.handleDraft(interaction);
            return;
        }

        if (interaction.commandName === "config") {
            if (interaction.options.getSubcommand() === "show") {
                await this.handleShowConfig(interaction);
                return;
            }

            if (interaction.options.getSubcommandGroup() === "civ-groups") {
                const subcommand = interaction.options.data[0].options![0].name;

                if (subcommand === "enable") {
                    await this.handleEnableCivGroup(interaction);
                    return;
                }

                if (subcommand === "disable") {
                    await this.handleDisableCivGroup(interaction);
                    return;
                }
            }

            if (interaction.options.getSubcommandGroup() === "civs") {
                const subcommand = interaction.options.data[0].options![0].name;

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
        }
    }
}