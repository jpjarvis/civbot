import {CivGroup} from "../CivGroups";
import {CivsRepository} from "./interface";
import {UserDataStore} from "../UserDataStore/interface";
import CivDataAccessor from "./CivData/CivDataAccessor";


export default class FileAndUserDataCivsRepository implements CivsRepository {
    private userDataStore: UserDataStore;
    private civDataAccessor: CivDataAccessor;
    
    constructor(userDataStore: UserDataStore, civDataAccessor: CivDataAccessor) {
        this.userDataStore = userDataStore;
        this.civDataAccessor = civDataAccessor;
    }
    
    async getCivs(groups: Set<CivGroup>, serverId: string): Promise<string[]> {
        const civData = this.civDataAccessor.getCivData();
        const userData = await this.userDataStore.load(serverId);

        return Array.from(groups)
            .map((civGroup) => {
                if (civGroup === "custom") {
                    return userData.customCivs;
                }
                return civData.civs[civGroup];
            })
            .reduce((prev: string[], current: string[]) => current.concat(prev));
    }
}

