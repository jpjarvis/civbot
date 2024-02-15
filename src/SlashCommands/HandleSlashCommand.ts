import { ChatInputCommandInteraction } from "discord.js";
import { draftCommand } from "../Commands/Draft/DraftCommand";
import { enableExpansionCommand } from "../Commands/Expansions/EnableExpansion";
import { banCommand } from "../Commands/Ban/BanCommand";
import { unbanCommand } from "../Commands/Ban/UnbanCommand";
import { switchGameCommand } from "../Commands/SwitchGame/SwitchGameCommand";
import { disableExpansionCommand } from "../Commands/Expansions/DisableExpansionCommand";
import { showConfigCommand } from "../Commands/Config/ShowConfigCommand";
import { customCivsCommand } from "../Commands/CustomCivs/CustomCivsCommand";
import { logError, logInfo } from "../Log";

export async function handleSlashCommand(interaction: ChatInputCommandInteraction) {
    logInfo(
        `Received interaction "${interaction.commandName}" with parameters { ${interaction.options.data.map((x) => `${x.name}: ${x.value}`).join(", ")} }`,
    );

    if (interaction.commandName === "draft") {
        await draftCommand(interaction);
        return;
    }

    if (interaction.commandName === "config") {
        await showConfigCommand(interaction);
        return;
    }

    if (interaction.commandName === "expansions") {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === "enable") {
            await enableExpansionCommand(interaction);
            return;
        }

        if (subcommand === "disable") {
            await disableExpansionCommand(interaction);
            return;
        }
    }

    if (interaction.commandName === "custom-civs") {
        await customCivsCommand(interaction);
        return;
    }

    if (interaction.commandName === "ban") {
        await banCommand(interaction);
        return;
    }

    if (interaction.commandName === "unban") {
        await unbanCommand(interaction);
        return;
    }

    if (interaction.commandName === "switch-game") {
        await switchGameCommand(interaction);
        return;
    }

    logError(`Unrecognised slash command ${interaction.commandName}.`);
    await interaction.reply("Sorry, I don't recognise that command. This is probably a bug.");
}
