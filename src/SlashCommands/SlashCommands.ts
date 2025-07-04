import { ApplicationCommandData, ApplicationCommandOptionType } from "discord.js";
import { expansionsInGame, displayName } from "../Civs/Expansions";
import { CivGame } from "../Civs/CivGames";

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
                type: ApplicationCommandOptionType.Boolean,
                name: "guarantee-coastal",
                description: "Ensure that each player receives at least one civ with a coastal bias",
                required: false,
            }
        ],
    };

    const expansionsCommand: ApplicationCommandData = {
        name: "expansions",
        description: `Manage which ${game} expansions are used in the draft`,
        options: [
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "enable",
                description: `Add a ${game} expansion to your drafts`,
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
                description: `Remove a ${game} expansion from your drafts`,
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

    const customCivsCommand: ApplicationCommandData = {
        name: "custom-civs",
        description: "Add custom civs to your draft",
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
                description: "Name of the civ to ban",
                autocomplete: true,
            },
        ],
    };

    const unbanCommand: ApplicationCommandData = {
        name: "unban",
        description: "Unban a civ that was previously banned with /ban",
        options: [
            {
                type: ApplicationCommandOptionType.String,
                name: "civ",
                description: "Name of the banned civ to unban",
                autocomplete: true,
            },
        ],
    };

    const switchGameCommand: ApplicationCommandData = {
        name: "switch-game",
        description: `Switch to drafting for ${game === "Civ 5" ? "Civ 6" : "Civ 5"}`,
        options: [],
    };

    return [
        draftCommand,
        expansionsCommand,
        customCivsCommand,
        configCommand,
        banCommand,
        unbanCommand,
        switchGameCommand,
    ];
}
