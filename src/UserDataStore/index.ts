import FileUserDataStore from "./FileUserDataStore";
import {UserDataStore} from "./interface";
import PostgresDataStore from "./PostgresDataStore";

export const UserDataStoreInstance : UserDataStore = process.env['DATABASE_URL'] ? new PostgresDataStore() : new FileUserDataStore()