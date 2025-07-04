import {Expansion} from "../../Civs/Expansions";
import {draft, draftWithGuaranteedCoastal} from "./Draft";
import {selectCivIds} from "../../Civs/SelectCivIds";
import {UserSettings} from "../../UserData/UserSettings";
import {generateDraftMessage} from "./DraftCommandMessages";
import {ChatInputCommandInteraction, CommandInteraction, Message} from "discord.js";
import {getVoiceChannelMembers} from "../../Discord/VoiceChannels";
import {loadUserData} from "../../UserDataStore";
import {isFeatureEnabled} from "../../UserData/FeatureFlags";
import {Civ, CivId, getCiv} from "../../Civs/Civs";
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
        draftResult,
    );

    const rerollEnabled = isFeatureEnabled(userData, "AllowReroll");
    const canReroll = rerollEnabled && (interaction.guild?.members.me?.permissions.has("ManageMessages") ?? false);
    const showRerollMessage = rerollEnabled && !draftResult.isError;

    const message = await interaction.reply({
        content: showRerollMessage ? addRerollMessage(draftMessage, canReroll) : draftMessage,
        fetchReply: true,
    });

    if (canReroll && !draftResult.isError) {
        await handleReroll(message, interaction, draftMessage, () => {
            return generateDraftMessage(
                userData.game,
                draftArgs.expansions,
                userSettings.customCivs.length,
                draft(players, draftArgs.numberOfCivs, civs),
            );
        });
    }
}

async function handleReroll(
    message: Message,
    interaction: CommandInteraction,
    initialDraftMessage: string,
    generateNewMessage: () => string,
) {
    let currentDraftMessage = initialDraftMessage;

    const voiceChannelMembers = await getVoiceChannelMembers(interaction);

    let timedOut = false;
    const reactionsNeeded = voiceChannelMembers.length > 0 ? voiceChannelMembers.length : 1;
    while (!timedOut) {
        await message.react("🔁");
        const reactions = await message.awaitReactions({
            max: reactionsNeeded,
            filter: (reaction, user) =>
                reaction.emoji.name === "🔁" &&
                (voiceChannelMembers.includes(user.username) || user.id === interaction.user.id),
            time: 120_000,
        });

        if (reactions.first()?.count ?? 0 >= reactionsNeeded) {
            currentDraftMessage = generateNewMessage();
            await message.edit(addRerollMessage(currentDraftMessage, true));
            await message.reactions.removeAll();
        } else {
            await message.edit(currentDraftMessage);
            await message.reactions.removeAll();
            timedOut = true;
        }
    }
}

function addMessage(mainText: string, message: string) {
    return `${mainText}${message}`;
}

function addRerollMessage(draftMessage: string, canReroll: boolean) {
    return addMessage(
        draftMessage,
        canReroll
            ? `React with 🔁 to request a re-roll. If all players request it, the draft will be re-rolled.`
            : `Re-rolling is currently disabled since the bot does not have Manage Messages permissions.`,
    );
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

    return {
        numberOfCivs: civs,
        numberOfAi: ai,
    };
}
