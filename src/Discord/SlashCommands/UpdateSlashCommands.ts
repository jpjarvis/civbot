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
            client.application?.commands.create(command);
        }

        console.log("Done");
        client.destroy();
    });

    await client.login(getToken());
}

updateSlashCommands();
