import {Expansion} from "../../Civs/Expansions";
import {draft, draftWithGuaranteedCoastal} from "./Draft";
import {selectCivIds} from "../../Civs/SelectCivIds";
import {UserSettings} from "../../UserData/UserSettings";
import {generateDraftMessage} from "./DraftCommandMessages";
import {ChatInputCommandInteraction} from "discord.js";
import {getVoiceChannelMembers} from "../../Discord/VoiceChannels";
import {loadUserData} from "../../UserDataStore";
import {DraftedCiv} from "./DraftTypes";

export type DraftArguments = {
    numberOfAi: number;
    numberOfCivs: number;
    expansions: Expansion[];
    guaranteeCoastal: boolean;
};

export async function draftCommand(interaction: ChatInputCommandInteraction) {
    const serverId = interaction.guildId!;

    const providedArgs = extractDraftArguments(interaction);

    const userData = await loadUserData(serverId);
    const userSettings = userData.userSettings[userData.game];
    const draftArgs = fillDefaultArguments(providedArgs, userSettings);

    const players = (await getVoiceChannelMembers(interaction)).concat(generateAiPlayers(draftArgs.numberOfAi));
    const civs: DraftedCiv[] = selectCivIds(draftArgs.expansions, userSettings.bannedCivs)
        .map(x => ({custom: false, id: x}));

    const civsIncludingCustom = civs.concat(userSettings.customCivs.map(x => ({custom: true, name: x})));

    const draftResult = draftArgs.guaranteeCoastal ? 
        draftWithGuaranteedCoastal(players, draftArgs.numberOfCivs, civsIncludingCustom) : 
        draft(players, draftArgs.numberOfCivs, civsIncludingCustom);
    
    let draftMessage = generateDraftMessage(
        userData.game,
        draftArgs.expansions,
        userSettings.customCivs.length,
        draftArgs.guaranteeCoastal,
        draftResult,
    );

    await interaction.reply(draftMessage);
}
function fillDefaultArguments(partialArgs: Partial<DraftArguments>, userSettings: UserSettings): DraftArguments {
    const defaultArgs = userSettings.defaultDraftSettings;

    return {
        numberOfAi: partialArgs.numberOfAi ?? defaultArgs.numberOfAi ?? 0,
        numberOfCivs: partialArgs.numberOfCivs ?? defaultArgs.numberOfCivs ?? 3,
        expansions: partialArgs.expansions ?? defaultArgs.expansions ?? ["civ5-vanilla"],
        guaranteeCoastal: partialArgs.guaranteeCoastal ?? false,
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
    const guaranteeCoastal = interaction.options.getBoolean("guarantee-coastal") ?? undefined;

    return {
        numberOfCivs: civs,
        numberOfAi: ai,
        guaranteeCoastal: guaranteeCoastal
    };
}
