import { Client } from "@typeit/discord";
import { CivBot } from "./CivBot";
var auth = require('../auth/auth.json')

async function start() {
  const client = new Client();
  await client.login(auth.token, CivBot);
}

start();