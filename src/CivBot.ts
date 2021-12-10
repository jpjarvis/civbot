import MessageHandler from "./MessageHandler";
import SlashCommandHandler from "./SlashCommandHandler";
import {Client, CommandInteraction, Message} from "discord.js";

export default class CivBot {
    private messageHandler: MessageHandler;
    private slashCommandHandler: SlashCommandHandler;
    
    constructor(messageHandler: MessageHandler, slashCommandHandler: SlashCommandHandler) {
        this.messageHandler = messageHandler;
        this.slashCommandHandler = slashCommandHandler;
    }
    
    async handleSlashCommand(interaction: CommandInteraction) {
        return this.slashCommandHandler.handle(interaction)
    }

    async handleMessage(message: Message, client: Client) {
        return this.messageHandler.handle(message, client)
    }
}