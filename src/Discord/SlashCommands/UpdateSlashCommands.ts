import { Client, GatewayIntentBits } from "discord.js";
import { Commands } from "./SlashCommands";
import { getToken } from "../../Auth";

async function updateSlashCommands() {
    const client = new Client({
        intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
    });

    client.once("ready", async () => {
        console.log("Updating slash commands...");

        for (let command of Commands) {
            client.application?.commands.create(command, "493399082757259284");
        }

        console.log("Done");
        await client.destroy();
    });

    await client.login(getToken());
}

updateSlashCommands();
