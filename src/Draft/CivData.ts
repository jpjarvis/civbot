import {Civ5CivGroup, Civ6CivGroup} from "./Types/CivGroups";

export default interface CivData {
    civs: {
        [group in Civ5CivGroup | Civ6CivGroup]: string[]
    };
}