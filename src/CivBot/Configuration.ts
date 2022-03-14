import CivBot from "./CivBot";
import SlashCommandHandler from "./SlashCommands/SlashCommandHandler";
import MessageHandler from "./Messages/MessageHandler";
import {UserDataStore} from "./UserDataStore/UserDataStore";
import PostgresDataStore from "./UserDataStore/PostgresDataStore";
import FileUserDataStore from "./UserDataStore/FileUserDataStore";
import {loadCivDataFromFile} from "./CivData";

export function constructCivBot(): CivBot {
    const userDataStore : UserDataStore = process.env['DATABASE_URL'] ? new PostgresDataStore() : new FileUserDataStore()
    const getCivData = () => loadCivDataFromFile("civs.json");
    
    const slashCommandHandler = new SlashCommandHandler(userDataStore, getCivData)
    const messageHandler = new MessageHandler(userDataStore, getCivData)
    
    return new CivBot(messageHandler, slashCommandHandler)
}