import {Civ5CivGroup, Civ6CivGroup} from "../../CivGroups";

export default interface CivData {
    civs: {
        [group in Civ5CivGroup | Civ6CivGroup]: string[]
    };
}