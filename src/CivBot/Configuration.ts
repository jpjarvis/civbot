import CivBot from "./CivBot";
import SlashCommandHandler from "./SlashCommands/SlashCommandHandler";
import MessageHandler from "./Messages/MessageHandler";
import {UserDataStore} from "./UserDataStore/UserDataStore";
import PostgresDataStore from "./UserDataStore/PostgresDataStore";
import FileUserDataStore from "./UserDataStore/FileUserDataStore";

export function constructCivBot(): CivBot {
    const userDataStore : UserDataStore = process.env['DATABASE_URL'] ? new PostgresDataStore() : new FileUserDataStore()
    
    const slashCommandHandler = new SlashCommandHandler(userDataStore)
    const messageHandler = new MessageHandler(userDataStore)
    
    return new CivBot(messageHandler, slashCommandHandler)
}