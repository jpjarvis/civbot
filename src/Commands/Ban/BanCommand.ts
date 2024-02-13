import {loadUserData, saveUserData} from "../../UserDataStore";
import {matchCivs} from "./CivExists";
import {Civ, civsEqual, hasLeader} from "../../Civs/Civs";
import {ChatInputCommandInteraction, Message} from "discord.js";
import {UserData} from "../../UserData/UserData";
import {logInfo} from "../../Log";

export async function handleBan(interaction: ChatInputCommandInteraction) {
    const serverId = interaction.guildId!;

    const searchString = interaction.options.getString("civ")!;
    const userData = await loadUserData(serverId);

    const allMatchedCivs = matchCivs(searchString, userData.game);
    const alreadyBannedCivs = allMatchedCivs.filter(x => isBanned(x, userData))
    const availableMatchedCivs = allMatchedCivs.filter(x => !isBanned(x, userData))
    
    if (availableMatchedCivs.length === 0) {
        if (alreadyBannedCivs.length == 1) {
            await interaction.reply(`\`${renderCiv(alreadyBannedCivs[0])}\` is already banned.`);
        }
        else if (alreadyBannedCivs.length > 1) {
            await interaction.reply(`"${searchString}" matches ${alreadyBannedCivs.length} civs, but they are all already banned.`);
        }
        await interaction.reply(`No civ called "${searchString}" exists in ${userData.game}.`);
        return;
    } else if (availableMatchedCivs.length > numberEmojis.length) {
        await interaction.reply(`"${searchString}" matches ${availableMatchedCivs.length} civs that aren't already banned. Please me more specific.`);
        return;
    } else if (availableMatchedCivs.length > 1) {
        const message = await interaction.reply({
            content: renderCivSelectionMessage(searchString, availableMatchedCivs),
            fetchReply: true
        });

        logInfo("Matched multiple civs. Waiting for user reaction...");
        await addReactions(message, availableMatchedCivs.length);
        const reactionEmoji = await waitForUserReaction(message, interaction.user.id);

        if (reactionEmoji === undefined) {
            await message.edit(`Request to ban civ timed out.`);
            return;
        }
        if (reactionEmoji === allEmoji) {
            await banCivs(serverId, userData, availableMatchedCivs);
            await message.edit(banMessage(availableMatchedCivs));
            return;
        } else if (numberEmojis.includes(reactionEmoji)) {
            const chosenCiv = availableMatchedCivs[numberEmojis.indexOf(reactionEmoji)];
            await banCivs(serverId, userData, [chosenCiv]);
            await message.edit(banMessage([chosenCiv]));
            return;
        }
    }

    await banCivs(serverId, userData, availableMatchedCivs);
    await interaction.reply(banMessage(availableMatchedCivs));
}

async function banCivs(serverId: string, userData: UserData, civsToBan: Civ[]) {
    userData.userSettings[userData.game].bannedCivs = userData.userSettings[userData.game].bannedCivs.concat(civsToBan);
    await saveUserData(serverId, userData);
}

function isBanned(civ: Civ, userData: UserData) {
    return userData.userSettings[userData.game].bannedCivs.some(x => civsEqual(x, civ));
}

function banMessage(bannedCivs: Civ[]) {
    if (bannedCivs.length == 1) {
        return `\`${renderCiv(bannedCivs[0])}\` has been banned. It will no longer appear in your drafts.`;
    }

    return `The following civs have been banned: \`\`\`${bannedCivs.map(x => renderCiv(x)).join("\n")}\`\`\` They will no longer appear in your drafts.`;
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
    return `"${civToBan}" matches ${matchedCivs.length} civs that aren't already banned. Please click one of the reacts to select which one to ban:
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