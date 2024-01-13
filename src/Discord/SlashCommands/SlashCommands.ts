import { ApplicationCommandData, ApplicationCommandOptionType } from "discord.js";
import {Expansions, expansionsInGame, displayName} from "../../Civs/Expansions";
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
                name: "expansions",
                description: "Space-separated list of expansions to include",
            },
        ],
    };

    const expansionsCommand: ApplicationCommandData = {
        name: "expansions",
        description: "Manage which expansions are used in the draft",
        options: [
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "enable",
                description: "Add an expansion to your drafts",
                options: [
                    {
                        type: ApplicationCommandOptionType.String,
                        name: "expansion",
                        description: "The expansion to add",
                        required: true,
                        choices: expansionsInGame(game).map((cg) => {
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
                description: "Remove an expansion from your drafts",
                options: [
                    {
                        type: ApplicationCommandOptionType.String,
                        name: "expansion",
                        description: "The expansion to remove",
                        required: true,
                        choices: expansionsInGame(game).map((cg) => {
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

    return [draftCommand, expansionsCommand, civsCommand, configCommand, banCommand, unbanCommand, switchGameCommand];
}