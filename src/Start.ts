import { ApplicationCommandManager, Client, Intents } from "discord.js"
import { handleMessage } from "./HandleMessage"
import { handleSlashCommand } from "./HandleSlashCommand"
import { Commands } from "./SlashCommands"
var auth = require('../auth/auth.json')

async function start() {
  const client = new Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES
    ]
  })

  const applicationCommandManager = new ApplicationCommandManager(client)

  client.once("ready", async () => {
    console.log("Updating slash commands...")

    for(let command of Commands) {
      await applicationCommandManager.create(command, "493399082757259284")
    }
    
    console.log("Done")
    console.log("CivBot is alive!")
  })

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return

    await handleSlashCommand(interaction)
  })

  client.on("messageCreate", async (message) => {
    await handleMessage(message, client)
  })

  await client.login(auth.token)
}

start();
