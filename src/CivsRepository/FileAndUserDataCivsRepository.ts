import {Civ5CivGroup, Civ6CivGroup, CivGroup} from "../CivGroups";
import * as fs from 'fs';
import {UserDataStoreInstance} from "../UserDataStore";
import {CivsRepository} from "./interface";

interface CivData {
    civs: {
        [group in Civ5CivGroup | Civ6CivGroup]: string[]
    };
}

function getCivsJson(): CivData {
    return JSON.parse(fs.readFileSync("civs.json", "utf-8"));
}

export default class FileAndUserDataCivsRepository implements CivsRepository {
    async getCivs(groups: Set<CivGroup>, serverId: string): Promise<string[]> {
        const civsJson = getCivsJson();
        const userData = await UserDataStoreInstance.load(serverId);

        return Array.from(groups)
            .map((civGroup) => {
                if (civGroup === "custom") {
                    return userData.customCivs;
                }
                return civsJson.civs[civGroup];
            })
            .reduce((prev: string[], current: string[]) => current.concat(prev));
    }
}

