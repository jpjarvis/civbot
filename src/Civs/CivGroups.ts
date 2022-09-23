import { Civs } from "./Civs";

export type CivGroup = keyof typeof Civs | "custom";
export const CivGroups = Object.keys(Civs).concat("custom") as CivGroup[];

export function stringToCivGroup(string: string): CivGroup | undefined {
    return CivGroups.find((cg) => cg === string);
}
