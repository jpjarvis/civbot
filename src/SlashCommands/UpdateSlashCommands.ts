import { Client } from "discord.js";
import { getCommands } from "./SlashCommands";
import { loadUserData } from "../UserDataStore";
import { logInfo } from "../Log";

export async function updateSlashCommandsForAllServers(client: Client) {
    const guilds = client.guilds.valueOf().keys();
    for (let serverId of guilds) {
        logInfo(`Updating commands for guild ${serverId}...`);
        await updateSlashCommandsForServer(client, serverId);
    }
    logInfo("Done!");
}

export async function updateSlashCommandsForServer(client: Client, serverId: string) {
    const userData = await loadUserData(serverId);
    client.application?.commands.set(getCommands(userData.game), serverId);
}
