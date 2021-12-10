import {Client, Intents} from "discord.js";
import MessageHandler from "./MessageHandler";
import SlashCommandHandler from "./SlashCommandHandler";
import Messages from "./Messages";
import {getToken} from "./Auth";
import {DraftCommand} from "./DraftCommand";
import {UserDataStoreInstance} from "./UserDataStore";
import {DraftExecutor} from "./Draft";
import {CivsRepositoryInstance} from "./CivsRepository";

async function start() {
    const client = new Client({
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_VOICE_STATES
        ]
    });
    
    const draftExecutor = new DraftExecutor(CivsRepositoryInstance)
    const draftCommand = new DraftCommand(draftExecutor, UserDataStoreInstance)
    const slashCommandHandler = new SlashCommandHandler(draftCommand, UserDataStoreInstance)
    const messageHandler = new MessageHandler(draftCommand, UserDataStoreInstance)

    client.once("ready", async () => {
        console.log("CivBot is alive!");
    });

    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isCommand()) return;

        try {
            await slashCommandHandler.handle(interaction);
        } catch (e) {
            console.log(e);
            await interaction.reply(Messages.GenericError);
        }
    });

    client.on("messageCreate", async (message) => {
        try {
            await messageHandler.handle(message, client);
        } catch (e) {
            console.log(e);
            message.channel.send(Messages.GenericError);
        }
    });

    await client.login(getToken());
}

start();
