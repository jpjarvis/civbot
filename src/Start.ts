import { Client } from "@typeit/discord";
import { Intents } from "discord.js";
import { CivBot } from "./CivBot";
var auth = require('../auth/auth.json')

async function start() {
  const client = new Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES
    ]
  });
  await client.login(auth.token, CivBot);
}

start();