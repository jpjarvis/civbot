import {ChatInputCommandInteraction} from "discord.js";
import {handleDraft} from "../../Commands/Draft/DraftCommand";
import {handleEnableExpansion} from "../../Commands/Expansions/EnableExpansion";
import {handleBan} from "../../Commands/Ban/BanCommand";
import {handleUnban} from "../../Commands/Ban/UnbanCommand";
import {handleSwitchGame} from "../../Commands/SwitchGame/SwitchGameCommand";
import {handleDisableExpansion} from "../../Commands/Expansions/DisableExpansionCommand";
import {handleShowConfig} from "../../Commands/Config/ShowConfigCommand";
import {handleCustomCivs} from "../../Commands/CustomCivs/CustomCivsCommand";
import {logError, logInfo} from "../../Log";

export async function handleSlashCommand(interaction: ChatInputCommandInteraction) {
    logInfo(`Received interaction "${interaction.commandName}" with parameters { ${interaction.options.data.map(x => `${x.name}: ${x.value}`).join(", ")} }`);

    if (interaction.commandName === "draft") {
        await handleDraft(interaction);
        return;
    }

    if (interaction.commandName === "config") {
        await handleShowConfig(interaction);
        return;
    }

    if (interaction.commandName === "expansions") {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === "enable") {
            await handleEnableExpansion(interaction);
            return;
        }

        if (subcommand === "disable") {
            await handleDisableExpansion(interaction);
            return;
        }
    }

    if (interaction.commandName === "custom-civs") {
        await handleCustomCivs(interaction);
        return;
    }

    if (interaction.commandName === "ban") {
        await handleBan(interaction);
        return;
    }

    if (interaction.commandName === "unban") {
        await handleUnban(interaction);
        return;
    }

    if (interaction.commandName === "switch-game") {
        await handleSwitchGame(interaction);
        return;
    }

    logError(`Unrecognised slash command ${interaction.commandName}.`);
    await interaction.reply("Sorry, I don't recognise that command. This is probably a bug.");
}
