import {Client, GatewayIntentBits} from "discord.js";
import Messages from "./Messages";
import { getToken } from "./Auth";
import { handleSlashCommand } from "./Discord/SlashCommands/HandleSlashCommand";
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

    await client.login(getToken());
}

start();
