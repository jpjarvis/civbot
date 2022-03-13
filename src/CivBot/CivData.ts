import {Civ5CivGroup, Civ6CivGroup} from "./Types/CivGroups";
import * as fs from "fs";

export interface CivData {
    civs: {
        [group in Civ5CivGroup | Civ6CivGroup]: string[]
    };
}

export function loadCivDataFromFile(filePath: string) : CivData {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}