import {ApplicationCommandData} from "discord.js";
import {CivGroups} from "../Types/CivGroups";

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
            type: "STRING",
            name: "civ-groups",
            description: "Space-separated list of civ groups to include"
        }
    ]
};

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
            type: "SUB_COMMAND_GROUP",
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
                            choices: CivGroups.map(cg => {
                                return {
                                    name: cg,
                                    value: cg
                                };
                            })
                        }
                    ]
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
                            choices: CivGroups.map(cg => {
                                return {
                                    name: cg,
                                    value: cg
                                };
                            })
                        }
                    ]
                }
            ]
        },
        {
            type: "SUB_COMMAND_GROUP",
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
                            required: true
                        }
                    ]
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
                            required: true
                        }
                    ]
                },
                {
                    type: "SUB_COMMAND",
                    name: "clear",
                    description: "Remove all custom civs",
                    options: []
                }
            ]
        }

    ]
};

export const Commands = [draftCommand, configCommand];