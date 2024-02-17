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

    const providedArgs = extractDraftArguments(interaction);

    const voiceChannelMembers = await getVoiceChannelMembers(interaction);

    const userData = await loadUserData(serverId);
    const userSettings = userData.userSettings[userData.game];
    const draftArgs = fillDefaultArguments(providedArgs, userSettings);

    const players = voiceChannelMembers.concat(generateAiPlayers(draftArgs.numberOfAi));
    const civs = selectCivs(draftArgs.expansions, userSettings.bannedCivs).concat(userSettings.customCivs);

    const draftResult = draft(players, draftArgs.numberOfCivs, civs);

    await interaction.reply(generateDraftCommandOutputMessage(userData.game, draftArgs.expansions, userSettings.customCivs.length, draftResult));
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

function extractDraftArguments(interaction: ChatInputCommandInteraction): Partial<DraftArguments> {
    const ai = interaction.options.getInteger("ai") ?? undefined;
    const civs = interaction.options.getInteger("civs") ?? undefined;

    return {
        numberOfCivs: civs,
        numberOfAi: ai,
    };
}
