import { Client, Intents } from "discord.js"
import { handleMessage } from "./HandleMessage"
import "reflect-metadata"
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

  client.on("messageCreate", async (message) => {
    await handleMessage(message, client)
  })

  await client.login(auth.token)
}

start();