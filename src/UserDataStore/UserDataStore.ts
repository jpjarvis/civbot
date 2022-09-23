import { UserData } from "../UserData/UserData";

export type UserDataStore = {
    load(tenantId: string): Promise<UserData>;

    save(tenantId: string, userData: UserData): Promise<void>;
}
