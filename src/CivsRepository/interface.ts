import {CivGroup} from "../CivGroups";

export interface CivsRepository {
    getCivs(civGroups: Set<CivGroup>, serverId: string): Promise<string[]>;
}