import {CivGroup} from "./Types/CivGroups";

export interface CivsRepository {
    getCivs(civGroups: Set<CivGroup>, tenantId: string): Promise<string[]>;
}