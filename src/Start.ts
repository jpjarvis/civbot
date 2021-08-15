import { Client, Intents } from "discord.js"
import { handleMessage } from "./HandleMessage"
import { handleSlashCommand } from "./HandleSlashCommand"
var auth = require('../auth/auth.json')

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
    if (!interaction.isCommand()) return;

    await handleSlashCommand(interaction, client)
  })

  client.on("messageCreate", async (message) => {
    await handleMessage(message, client)
  })

  await client.login(auth.token)
}

start();