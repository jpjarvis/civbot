import { Client, Intents } from "discord.js";
import Messages from "./Messages";
import { getToken } from "./Auth";
import { handleSlashCommand } from "./Discord/SlashCommands/HandleSlashCommand";
import { handleMessage } from "./Discord/Messages/HandleMessage";
import {logError, logException, logInfo} from "./Log";

async function start() {
    const client = new Client({
        intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES],
    });

    client.once("ready", async () => {
        logInfo("CivBot is alive!");
    });

    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isCommand()) return;

        try {
            await handleSlashCommand(interaction);
        } catch (e) {
            if (e instanceof Error) {
                logException(e);
            }
            await interaction.reply(Messages.GenericError);
        }
    });

    client.on("messageCreate", async (message) => {
        try {
            await handleMessage(message, client);
        } catch (e) {
            if (e instanceof Error) {
                logException(e);
            }
            message.channel.send(Messages.GenericError);
        }
    });

    await client.login(getToken());
}

start();
