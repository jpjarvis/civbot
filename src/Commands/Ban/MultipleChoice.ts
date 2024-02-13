import {CommandInteraction, Message} from "discord.js";

const numberEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣']
const allEmoji = '💥'
export const MAX_OPTIONS = numberEmojis.length;

export async function multipleChoice<TOption>(
    interaction: CommandInteraction,
    options: TOption[],
    renderOption: (option: TOption) => string,
    messages: {
        question: string,
        timeout: string,
        selected: (selectedOptions: TOption[]) => string
    }
): Promise<TOption[] | undefined> {
    const reply = await interaction.reply({
        content: `${messages.question}
${renderOptionsMessage(options.map(renderOption))}`,
        fetchReply: true
    });

    await addReactions(reply, options.length);
    const reactionEmoji = await waitForUserReaction(reply, interaction.user.id);

    if (reactionEmoji === undefined) {
        await reply.edit(messages.timeout);
        return undefined;
    }
    if (reactionEmoji === allEmoji) {
        await reply.edit(messages.selected(options));
        return options;
    } else if (numberEmojis.includes(reactionEmoji)) {
        const selectedOption = options[numberEmojis.indexOf(reactionEmoji)];
        await reply.edit(messages.selected([selectedOption]));
        return [selectedOption];
    }
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

function renderOptionsMessage(options: string[]) {
    return `${options.map((x, i) => `${numberEmojis[i]}: ${x}`).join("\n")}
${allEmoji}: All`
}
