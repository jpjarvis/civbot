import CivBot from "./CivBot";
import {DraftExecutor} from "./Draft";
import {DraftCommand} from "./DraftCommand";
import SlashCommandHandler from "./SlashCommandHandler";
import MessageHandler from "./MessageHandler";
import {CivsRepository} from "./CivsRepository/interface";
import FileAndUserDataCivsRepository from "./CivsRepository/FileAndUserDataCivsRepository";
import {UserDataStore} from "./UserDataStore/interface";
import PostgresDataStore from "./UserDataStore/PostgresDataStore";
import FileUserDataStore from "./UserDataStore/FileUserDataStore";
import CivDataAccessor from "./CivsRepository/CivData/CivDataAccessor";
import JsonCivDataAccessor from "./CivsRepository/CivData/JsonCivDataAccessor";

export function constructCivBot(): CivBot {
    const civDataAccessor : CivDataAccessor = new JsonCivDataAccessor("civs.json")
    const userDataStore : UserDataStore = process.env['DATABASE_URL'] ? new PostgresDataStore() : new FileUserDataStore()
    const civsRepository : CivsRepository = new FileAndUserDataCivsRepository(userDataStore, civDataAccessor)
    
    const draftExecutor = new DraftExecutor(civsRepository)
    const draftCommand = new DraftCommand(draftExecutor, userDataStore)
    
    const slashCommandHandler = new SlashCommandHandler(draftCommand, userDataStore)
    const messageHandler = new MessageHandler(draftCommand, userDataStore)
    
    return new CivBot(messageHandler, slashCommandHandler)
}