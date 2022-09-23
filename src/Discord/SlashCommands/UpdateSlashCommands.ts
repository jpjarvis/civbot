import { ApplicationCommandManager, Client, Intents } from "discord.js";
import { Commands } from "./SlashCommands";
import { getToken } from "../../Auth";

async function updateSlashCommands() {
    const client = new Client({
        intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
    });

    client.once("ready", async () => {
        const applicationCommandManager = new ApplicationCommandManager(client);

        console.log("Updating slash commands...");

        for (let command of Commands) {
            await applicationCommandManager.create(command, "493399082757259284");
        }

        console.log("Done");
        client.destroy();
    });

    await client.login(getToken());
}

updateSlashCommands();
