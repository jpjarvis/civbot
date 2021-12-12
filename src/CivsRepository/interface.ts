import {CivGroup} from "../CivGroups";

export interface CivsRepository {
    getCivs(civGroups: Set<CivGroup>, tenantId: string): Promise<string[]>;
}