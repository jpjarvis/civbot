import {Client, GatewayIntentBits} from "discord.js";
import Messages from "./Messages";
import {getToken} from "./Auth";
import {handleSlashCommand} from "./Discord/SlashCommands/HandleSlashCommand";
import {logException, logInfo} from "./Log";
import {
    updateSlashCommandsForAllServers,
    updateSlashCommandsForServer
} from "./Discord/SlashCommands/UpdateSlashCommands";
import {handleModalSubmit} from "./Discord/Modals/HandleModalSubmit";

async function start() {
    const client = new Client({
        intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessageReactions],
    });

    client.once("ready", async () => {
        logInfo("Updating slash commands...");
        await updateSlashCommandsForAllServers(client);
        logInfo("CivBot is alive!");
    });

    client.on("guildCreate", async (guild) => {
        logInfo(`CivBot has been added to guild ${guild.name}.`);
        logInfo("Creating slash commands...");
        await updateSlashCommandsForServer(client, guild.id);
        logInfo("Done!");
    });

    client.on("interactionCreate", async (interaction) => {
        if (interaction.isChatInputCommand()) {
            try {
                await handleSlashCommand(interaction);
            } catch (e) {
                if (e instanceof Error) {
                    logException(e);
                }

                if (!interaction.replied) {
                    await interaction.reply(Messages.GenericError);
                }
            }
        }

        if (interaction.isModalSubmit()) {
            try {
                await handleModalSubmit(interaction);
            } catch (e) {
                if (e instanceof Error) {
                    logException(e);
                }
                await interaction.reply(Messages.GenericError);
            }
        }
    });

    await client.login(getToken());
}

start();
