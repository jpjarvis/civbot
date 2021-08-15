import { ApplicationCommandData } from "discord.js"
import { CivGroups } from "./CivGroups"

const draftCommand: ApplicationCommandData = {
    name: "draft",
    description: "Drafts a civ game for the players in your voice channel",
    options: [
        {
            type: "INTEGER",
            name: "ai",
            description: "Number of extra AI players to add (Default is 0)"
        },
        {
            type: "INTEGER",
            name: "civs",
            description: "Number of civs to draft for each player (Default is 3)"
        },
        {
            type: "BOOLEAN",
            name: "no-voice",
            description: "Don't include the players from the voice channel (Default is false)"
        },
        {
            type: "STRING",
            name: "civ-groups",
            description: "Space-separated list of civ groups to include"
        }
    ]
}

const configCommand: ApplicationCommandData = {
    name: "config",
    description: "Configure CivBot",
    options: [
        {
            type: "SUB_COMMAND",
            name: "show",
            description: "Show CivBot's current configuration"
        },
        {
            type: "SUB_COMMAND",
            name: "use",
            description: "Add a civ group to your drafts",
            options: [
                {
                    type: "STRING",
                    name: "civ-group",
                    description: "The civ group to add",
                    required: true,
                    choices: CivGroups.map(cg => {
                        return {
                            name: cg,
                            value: cg
                        }
                    })
                }
            ]
        }
    ]
}

export const Commands = [draftCommand, configCommand]