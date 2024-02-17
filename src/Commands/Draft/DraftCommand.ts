import { Expansion, stringToExpansion } from "../../Civs/Expansions";
import { draft } from "./Draft";
import { selectCivs } from "./SelectCivs";
import { UserSettings } from "../../UserData/UserSettings";
import { generateDraftCommandOutputMessage } from "./DraftCommandMessages";
import { Result } from "../../Functional/Result";
import { ChatInputCommandInteraction } from "discord.js";
import { getVoiceChannelMembers } from "../../Discord/VoiceChannels";
import { loadUserData } from "../../UserDataStore";

export type DraftArguments = {
    numberOfAi: number;
    numberOfCivs: number;
    expansions: Expansion[];
};

export async function draftCommand(interaction: ChatInputCommandInteraction) {
    const serverId = interaction.guildId!;

    const draftArgumentsOrError = extractDraftArguments(interaction);

    if (draftArgumentsOrError.isError) {
        await interaction.reply(draftArgumentsOrError.error);
        return;
    }

    const voiceChannelMembers = await getVoiceChannelMembers(interaction);

    const userData = await loadUserData(serverId);
    const userSettings = userData.userSettings[userData.game];
    const draftArgs = fillDefaultArguments(draftArgumentsOrError.value, userSettings);

    const players = voiceChannelMembers.concat(generateAiPlayers(draftArgs.numberOfAi));
    const civs = selectCivs(draftArgs.expansions, userSettings.bannedCivs);

    const draftResult = draft(players, draftArgs.numberOfCivs, civs);

    await interaction.reply(generateDraftCommandOutputMessage(userData.game, draftArgs.expansions, draftResult));
}

function fillDefaultArguments(partialArgs: Partial<DraftArguments>, userSettings: UserSettings): DraftArguments {
    const defaultArgs = userSettings.defaultDraftSettings;

    return {
        numberOfAi: partialArgs.numberOfAi ?? defaultArgs.numberOfAi ?? 0,
        numberOfCivs: partialArgs.numberOfCivs ?? defaultArgs.numberOfCivs ?? 3,
        expansions: partialArgs.expansions ?? defaultArgs.expansions ?? ["civ5-vanilla"],
    };
}

function generateAiPlayers(numberOfAiPlayers: number) {
    let players: string[] = [];
    for (let i = 0; i < numberOfAiPlayers; i++) {
        players.push(`AI ${i}`);
    }
    return players;
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
