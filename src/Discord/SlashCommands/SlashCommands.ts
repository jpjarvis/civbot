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

    const profilesCommand: ApplicationCommandData = {
        name: "profiles",
        description: "Load and save settings profiles",
        options: [
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "load",
                description: "Load a profile's settings",
                options: [
                    {
                        type: ApplicationCommandOptionType.String,
                        name: "profile-name",
                        description: "Name of the profile to load",
                    },
                ],
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "save",
                description: "Save the current settings into a profile",
                options: [
                    {
                        type: ApplicationCommandOptionType.String,
                        name: "profile-name",
                        description:
                            "Name to save the profile as. If a profile with the same name exists, it will be overwritten.",
                    },
                ],
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "show",
                description: "List your saved profiles",
            },
        ],
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
        description: `Switch to drafting for ${game === "Civ V" ? "Civ VI" : "Civ V"}`,
        options: []
    };

    return [draftCommand, civGroupsCommand, civsCommand, configCommand, profilesCommand, banCommand, unbanCommand, switchGameCommand];
}