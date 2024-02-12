import {loadUserData, saveUserData} from "../../UserDataStore";
import {matchCivs} from "./CivExists";
import {Civ, hasLeader} from "../../Civs/Civs";
import {ChatInputCommandInteraction, Message} from "discord.js";
import {UserData} from "../../UserData/UserData";
import {logInfo} from "../../Log";

export async function handleBan(interaction: ChatInputCommandInteraction) {
    const serverId = interaction.guildId!;

    const civToBan = interaction.options.getString("civ")!;
    const userData = await loadUserData(serverId);

    const matchedCivs = matchCivs(civToBan, userData.game);

    if (matchedCivs.length === 0) {
        await interaction.reply(`No civ called ${civToBan} exists in ${userData.game}.`);
        return;
    } else if (matchedCivs.length > numberEmojis.length) {
        await interaction.reply(`"${civToBan}" matches ${matchedCivs.length} civs. Please me more specific.`);
        return;
    } else if (matchedCivs.length > 1) {
        const message = await interaction.reply({
            content: renderCivSelectionMessage(civToBan, matchedCivs),
            fetchReply: true
        });

        logInfo("Matched multiple civs. Waiting for user reaction...");
        await addReactions(message, matchedCivs.length);
        const reactionEmoji = await waitForUserReaction(message, interaction.user.id);

        if (reactionEmoji === undefined) {
            await message.edit(`Request to ban civ timed out.`);
            return;
        }
        if (reactionEmoji === allEmoji) {
            await banCivs(serverId, userData, matchedCivs);
            await message.edit(banMessage(matchedCivs));
            return;
        } else if (numberEmojis.includes(reactionEmoji)) {
            const chosenCiv = matchedCivs[numberEmojis.indexOf(reactionEmoji)];
            await banCivs(serverId, userData, [chosenCiv]);
            await message.edit(banMessage([chosenCiv]));
            return;
        }
    }

    await banCivs(serverId, userData, matchedCivs);
    await interaction.reply(banMessage(matchedCivs));
}

async function banCivs(serverId: string, userData: UserData, civsToBan: Civ[]) {
    userData.userSettings[userData.game].bannedCivs = userData.userSettings[userData.game].bannedCivs.concat(civsToBan);
    await saveUserData(serverId, userData);
}

function banMessage(bannedCivs: Civ[]) {
    if (bannedCivs.length == 1) {
        return `\`${renderCiv(bannedCivs[0])}\` has been banned. It will no longer appear in your drafts.`;
    }

    return `${bannedCivs.map(x => `\`${x}\``).join(", ")} have been banned. They will no longer appear in your drafts.`;
}

async function addReactions(message: Message, numChoices: number) {
    await message.react(allEmoji)
    for (const emoji of numberEmojis.slice(0, numChoices)) {
        await message.react(emoji);
    }
}

async function waitForUserReaction(message: Message, userId: string) {
    const userReactions = await message.awaitReactions({
        filter: (reaction, user) => numberEmojis.concat(allEmoji).includes(reaction.emoji.name ?? "") && user.id === userId,
        time: 60_000,
        max: 1
    });

    return userReactions.first()?.emoji?.name ?? undefined;
}

function renderCivSelectionMessage(civToBan: Civ, matchedCivs: Civ[]) {
    return `"${civToBan}" matches ${matchedCivs.length} civs. Please click one of the reacts to select which one to ban:
${matchedCivs.map((x, i) => `${numberEmojis[i]}: ${renderCiv(x)}`).join("\n")}
${allEmoji}: All`
}

function renderCiv(civ: Civ): string {
    if (!hasLeader(civ)) {
        return civ;
    }

    return `${civ.leader} - ${civ.civ}`;
}

const numberEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣']
const allEmoji = '💥'