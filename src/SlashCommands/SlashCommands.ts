import { ApplicationCommandData } from "discord.js";
import { CivGroups } from "../Types/CivGroups";

const draftCommand: ApplicationCommandData = {
    name: "draft",
    description: "Drafts a civ game for the players in your voice channel",
    options: [
        {
            type: "INTEGER",
            name: "ai",
            description: "Number of extra AI players to add (Default is 0)",
        },
        {
            type: "INTEGER",
            name: "civs",
            description: "Number of civs to draft for each player (Default is 3)",
        },
        {
            type: "STRING",
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
            type: "SUB_COMMAND",
            name: "enable",
            description: "Add a civ group to your drafts",
            options: [
                {
                    type: "STRING",
                    name: "civ-group",
                    description: "The civ group to add",
                    required: true,
                    choices: CivGroups.map((cg) => {
                        return {
                            name: cg,
                            value: cg,
                        };
                    }),
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "disable",
            description: "Remove a civ group to your drafts",
            options: [
                {
                    type: "STRING",
                    name: "civ-group",
                    description: "The civ group to remove",
                    required: true,
                    choices: CivGroups.map((cg) => {
                        return {
                            name: cg,
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
            type: "SUB_COMMAND",
            name: "add",
            description: "Add custom civs",
            options: [
                {
                    type: "STRING",
                    name: "civs",
                    description: "Comma-separated list of civs to add",
                    required: true,
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "remove",
            description: "Remove custom civs",
            options: [
                {
                    type: "STRING",
                    name: "civs",
                    description: "Comma-separated list of civs to remove",
                    required: true,
                },
            ],
        },
        {
            type: "SUB_COMMAND",
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
            type: "SUB_COMMAND",
            name: "load",
            description: "Load a profile's settings",
            options: [
                {
                    type: "STRING",
                    name: "profile-name",
                    description: "Name of the profile to load",
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "save",
            description: "Save the current settings into a profile",
            options: [
                {
                    type: "STRING",
                    name: "profile-name",
                    description:
                        "Name to save the profile as. If a profile with the same name exists, it will be overwritten.",
                },
            ],
        },
        {
            type: "SUB_COMMAND",
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
            type: "STRING",
            name: "civ",
            description:
                "Name of the civ to ban",
        }
    ],
};

export const Commands = [draftCommand, civGroupsCommand, civsCommand, configCommand, profilesCommand, banCommand];
