import UserData from "./UserData";
import FileUserDataStore from "./FileUserDataStore";

export interface UserDataStore {
    load(serverId: string) : Promise<UserData>
    save(serverId: string, userData: UserData) : Promise<void>
}

export const UserDataStoreInstance : UserDataStore = new FileUserDataStore()