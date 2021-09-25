import {Client, Intents} from "discord.js"
import {handleMessage} from "./HandleMessage"
import {handleSlashCommand} from "./HandleSlashCommand"
import Messages from "./Messages"
import {getToken} from "./Auth"

async function start() {
    const client = new Client({
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES
        ]
    })

    client.once("ready", async () => {
        console.log("CivBot is alive!")
    })

    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isCommand()) return

        try {
            await handleSlashCommand(interaction)
        } catch (e) {
            console.log(e)
            await interaction.reply(Messages.GenericError)
        }
    })

    client.on("messageCreate", async (message) => {
        try {
            await handleMessage(message, client)
        } catch (e) {
            console.log(e)
            message.channel.send(Messages.GenericError)
        }
    })

    await client.login(getToken())
}

start();
