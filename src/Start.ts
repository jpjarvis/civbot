import { Client, Intents } from "discord.js";
import Messages from "./Messages";
import { getToken } from "./Auth";
import { constructCivBot } from "./Configuration";

async function start() {
    const client = new Client({
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_VOICE_STATES,
        ],
    });

    const civBot = constructCivBot();

    client.once("ready", async () => {
        console.log("CivBot is alive!");
    });

    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isCommand()) return;

        try {
            await civBot.handleSlashCommand(interaction);
        } catch (e) {
            console.log(e);
            await interaction.reply(Messages.GenericError);
        }
    });

    client.on("messageCreate", async (message) => {
        try {
            await civBot.handleMessage(message, client);
        } catch (e) {
            console.log(e);
            message.channel.send(Messages.GenericError);
        }
    });

    await client.login(getToken());
}

start();
