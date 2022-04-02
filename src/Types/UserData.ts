import {UserDataStore} from "../UserDataStore/UserDataStore";
import UserSettings from "./UserSettings";

export type UserData = {
    activeUserSettings: UserSettings;
    profiles: {
        [name in string]: UserSettings
    }
}

export function createEmptyUserData(): UserData {
    return {
        activeUserSettings: new UserSettings(),
        profiles: {}
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