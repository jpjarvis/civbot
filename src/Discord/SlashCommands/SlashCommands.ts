import { ApplicationCommandData, ApplicationCommandOptionType } from "discord.js";
import {CivGroups, civGroupsInGame, displayName} from "../../Civs/CivGroups";
import {CivGame} from "../../Civs/CivGames";

export function getCommands(game: CivGame) {
    const draftCommand: ApplicationCommandData = {
        name: "draft",
        description: "Drafts a civ game for the players in your voice channel",
        options: [
            {
                type: ApplicationCommandOptionType.Integer,
                name: "ai",
                description: "Number of extra AI players to add (Default is 0)",
            },
            {
                type: ApplicationCommandOptionType.Integer,
                name: "civs",
                description: "Number of civs to draft for each player (Default is 3)",
            },
            {
                type: ApplicationCommandOptionType.String,
                name: "civ-groups",
                description: "Space-separated list of civ groups to include",
            },
        ],
    };

    const civGroupsCommand: ApplicationCommandData = {
        name: "civ-groups",
        description: "Manage civ groups",
        options: [
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "enable",
                description: "Add a civ group to your drafts",
                options: [
                    {
                        type: ApplicationCommandOptionType.String,
                        name: "civ-group",
                        description: "The civ group to add",
                        required: true,
                        choices: civGroupsInGame(game).map((cg) => {
                            return {
                                name: displayName(cg),
                                value: cg,
                            };
                        }),
                    },
                ],
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "disable",
                description: "Remove a civ group from your drafts",
                options: [
                    {
                        type: ApplicationCommandOptionType.String,
                        name: "civ-group",
                        description: "The civ group to remove",
                        required: true,
                        choices: civGroupsInGame(game).map((cg) => {
                            return {
                                name: displayName(cg),
                                value: cg,
                            };
                        }),
                    },
                ],
            },
        ],
    };

    const civsCommand: ApplicationCommandData = {
        name: "civs",
        description: "Manage custom civs",
        options: [
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "add",
                description: "Add custom civs",
                options: [
                    {
                        type: ApplicationCommandOptionType.String,
                        name: "civs",
                        description: "Comma-separated list of civs to add",
                        required: true,
                    },
                ],
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "remove",
                description: "Remove custom civs",
                options: [
                    {
                        type: ApplicationCommandOptionType.String,
                        name: "civs",
                        description: "Comma-separated list of civs to remove",
                        required: true,
                    },
                ],
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "clear",
                description: "Remove all custom civs",
                options: [],
            },
        ],
    };

    const configCommand: ApplicationCommandData = {
        name: "config",
        description: "Show CivBot's current configuration",
    };

    const banCommand: ApplicationCommandData = {
        name: "ban",
        description: "Ban a civ, preventing it from appearing in drafts",
        options: [
            {
                type: ApplicationCommandOptionType.String,
                name: "civ",
                description:
                    "Name of the civ to ban",
            }
        ],
    };

    const unbanCommand: ApplicationCommandData = {
        name: "unban",
        description: "Unban a civ that was previously banned with /ban",
        options: [
            {
                type: ApplicationCommandOptionType.String,
                name: "civ",
                description:
                    "Name of the banned civ to unban",
            }
        ],
    };

    const switchGameCommand : ApplicationCommandData = {
        name: "switch-game",
        description: `Switch to drafting for ${game === "Civ 5" ? "Civ 6" : "Civ 5"}`,
        options: []
    };

    return [draftCommand, civGroupsCommand, civsCommand, configCommand, banCommand, unbanCommand, switchGameCommand];
}