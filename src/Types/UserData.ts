import {UserDataStore} from "../UserDataStore/UserDataStore";
import UserSettings from "./UserSettings";

export type UserData = {
    activeUserSettings: UserSettings;
    profiles: Map<string, UserSettings>;
}

export function createEmptyUserData(): UserData {
    return {
        activeUserSettings: new UserSettings(),
        profiles: new Map<string, UserSettings>()
    }
}

export class UserDataAccessor {
    private userDataStore: UserDataStore
    
    constructor(userDataStore: UserDataStore) {
        this.userDataStore = userDataStore;
    }
    
    async getActiveUserSettings(tenantId: string) {
        const data = await this.userDataStore.load(tenantId);
        return data.activeUserSettings;
    }
}