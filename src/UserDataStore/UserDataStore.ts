import {UserData} from "../Types/UserData";

export interface UserDataStore {
    load(tenantId: string): Promise<UserData>;

    save(tenantId: string, userData: UserData): Promise<void>;
}