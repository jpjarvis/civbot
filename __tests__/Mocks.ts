import UserData from "../src/UserData";
import {UserDataStore} from "../src/UserDataStore/interface";
import CivData from "../src/CivsRepository/CivData/CivData";
import CivDataAccessor from "../src/CivsRepository/CivData/CivDataAccessor";
import {CivsRepository} from "../src/CivsRepository/interface";
import {generateArray} from "./TestUtils";

export function createMockUserDataStore(userDatas: Map<string, UserData>): UserDataStore {
    return {
        load: async (serverId): Promise<UserData> => userDatas[serverId],
        save: async () => {
        }
    };
}

export function createMockCivDataAccessor(civData: CivData): CivDataAccessor {
    return {
        getCivData: (): CivData => civData
    };
}

export function createMockCivsRepository(numberOfCivs: number): CivsRepository {
    return {
        getCivs: async (civGroups, serverId) => generateArray(numberOfCivs)
    }
}