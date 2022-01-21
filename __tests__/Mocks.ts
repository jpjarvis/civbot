
import {generateArray} from "./TestUtils";
import {UserDataStore} from "../src/CivBot/UserDataStore/UserDataStore";
import CivDataAccessor from "../src/Draft/CivDataAccessor";
import UserData from "../src/CivBot/UserData";
import CivData from "../src/Draft/CivData";
import {CivsRepository} from "../src/Draft/CivsRepository";

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