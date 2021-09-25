import UserData from "../UserData";

export interface UserDataStore {
    load(serverId: string): Promise<UserData>;

    save(serverId: string, userData: UserData): Promise<void>;
}