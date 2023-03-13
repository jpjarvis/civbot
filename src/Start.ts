import {Client, GatewayIntentBits} from "discord.js";
import Messages from "./Messages";
import { getToken } from "./Auth";
import { handleSlashCommand } from "./Discord/SlashCommands/HandleSlashCommand";
import { handleMessage } from "./Discord/Messages/HandleMessage";
import {logException, logInfo} from "./Log";

async function start() {
    const client = new Client({
        intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates],
    });

    client.once("ready", async () => {
        logInfo("CivBot is alive!");
    });

    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

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
