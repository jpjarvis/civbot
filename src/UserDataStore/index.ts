import FileUserDataStore from "./FileUserDataStore";
import {UserDataStore} from "./interface";

export const UserDataStoreInstance : UserDataStore = new FileUserDataStore()