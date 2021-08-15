import fetch from "node-fetch"

const draftCommand = {
    name: "draft",
    description: "Drafts a civ game for the players in your voice channel",
    options: [
        {
            type: 4,
            name: "ai",
            description: "Number of extra AI players to add (Default is 0)"
        },
        {
            type: 4,
            name: "civs",
            description: "Number of civs to draft for each player (Default is 3)"
        },
        {
            type: 5,
            name: "no-voice",
            description: "Don't include the players from the voice channel (Default is false)"
        },
        {
            type: 3,
            name: "civ-groups",
            description: "Space-separated list of civ groups to include"
        }
    ]
}

export const Commands = [draftCommand]

export async function updateSlashCommands(token: string) {
    const appId = "601833566078369944"
    const guildId = "493399082757259284"
    const commandUrl = `https://discord.com/api/v9/applications/${appId}/guilds/${guildId}/commands`

    for (let command of Commands) {
        const response = await fetch(commandUrl, {method: "POST", body: JSON.stringify(command), headers: {Authorization: `Bot ${token}`, "Content-Type": "application/json"}})
        if (!response.ok) {
            throw new Error(`Updating slash commands failed: ${await response.text()}`)
        }
    }
}