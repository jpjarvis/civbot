import { Expansion } from "../../Civs/Expansions";
import { draft } from "./Draft";
import { selectCivs } from "../../Civs/SelectCivs";
import { UserSettings } from "../../UserData/UserSettings";
import { generateDraftMessage } from "./DraftCommandMessages";
import { ChatInputCommandInteraction } from "discord.js";
import { getVoiceChannelMembers } from "../../Discord/VoiceChannels";
import { loadUserData } from "../../UserDataStore";
import { isFeatureEnabled } from "../../UserData/FeatureFlags";

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

    let currentDraftMessage = generateDraftMessage(
        userData.game,
        draftArgs.expansions,
        userSettings.customCivs.length,
        draftResult,
    );
    
    const rerollEnabled = isFeatureEnabled(userData, "AllowReroll");
    const canReroll =
        rerollEnabled &&
        (interaction.guild?.members.me?.permissions.has("ManageMessages") ?? false);
    
    if (rerollEnabled && !draftResult.isError) {
        currentDraftMessage = addRerollMessage(currentDraftMessage, canReroll)
    }
    
    const message = await interaction.reply({
        content: currentDraftMessage,
        fetchReply: true,
    });
    
    if (!draftResult.isError && canReroll) {
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
                const draftResult = draft(players, draftArgs.numberOfCivs, civs);
                currentDraftMessage = generateDraftMessage(
                    userData.game,
                    draftArgs.expansions,
                    userSettings.customCivs.length,
                    draftResult,
                );
                await message.edit(addRerollMessage(currentDraftMessage, true));
                await message.reactions.removeAll();
            } else {
                await message.edit(currentDraftMessage);
                await message.reactions.removeAll();
                timedOut = true;
            }
        }
    }
}

function addRerollMessage(draftMessage: string, canReroll: boolean) {
    return `${draftMessage}${
        canReroll
            ? `React with 🔁 to request a re-roll. If all players request it, the draft will be re-rolled.`
            : `Re-rolling is currently disabled since the bot does not have Manage Messages permissions.`
    }`;
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
