import {Civs} from "./Civs";

export type CivGroup = keyof typeof Civs | "custom";

export function stringToCivGroup(string: string): CivGroup | undefined {
    if (Object.keys(Civs).includes(string) || string === "custom") {
        return string as CivGroup;
    }
    return undefined;
}