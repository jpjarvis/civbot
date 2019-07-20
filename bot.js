var Discord = require('discord.js')
var client = new Discord.Client()
var auth = require('./auth.json')
var fs = require('fs')

var civs = JSON.parse(fs.readFileSync("civs.json")).civs

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', msg => {
    if (msg.content === '!draft') {
        msg.channel.send(civs[0])
    }
})

client.login(auth.token);