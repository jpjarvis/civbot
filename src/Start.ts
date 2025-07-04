import { Client, GatewayIntentBits } from "discord.js";
import Messages from "./Messages";
import { getToken } from "./Auth";
import { handleSlashCommand } from "./SlashCommands/HandleSlashCommand";
import { logException, logInfo } from "./Log";
import { updateSlashCommandsForAllServers, updateSlashCommandsForServer } from "./SlashCommands/UpdateSlashCommands";
import { handleModalSubmit } from "./Modals/HandleModalSubmit";
import { banCommandAutocomplete, unbanCommandAutocomplete } from "./Commands/Ban/Autocomplete";
import {civBotReply} from "./Discord/CivBotReply";

async function start() {
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildMessageReactions,
        ],
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
                    await civBotReply(interaction, Messages.GenericError);
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
                await civBotReply(interaction, Messages.GenericError);
            }
        }

        if (interaction.isAutocomplete()) {
            if (interaction.commandName === "ban") {
                await banCommandAutocomplete(interaction);
            } else if (interaction.commandName === "unban") {
                await unbanCommandAutocomplete(interaction);
            }
        }
    });

    await client.login(getToken());
}

start();
