import CivBot from "./CivBot";
import {DraftExecutor} from "../Draft/DraftExecutor";
import {DraftCommand} from "./DraftCommand";
import SlashCommandHandler from "./SlashCommands/SlashCommandHandler";
import MessageHandler from "./Messages/MessageHandler";
import {CivsRepository} from "../Draft/CivsRepository";
import FileAndUserDataCivsRepository from "./FileAndUserDataCivsRepository";
import {UserDataStore} from "./UserDataStore/UserDataStore";
import PostgresDataStore from "./UserDataStore/PostgresDataStore";
import FileUserDataStore from "./UserDataStore/FileUserDataStore";
import CivDataAccessor from "../Draft/CivDataAccessor";
import JsonCivDataAccessor from "../Draft/JsonCivDataAccessor";

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