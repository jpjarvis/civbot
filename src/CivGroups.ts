const Civ5CivGroups = ["civ5-vanilla", "lekmod"] as const
const Civ6CivGroups = ["civ6-vanilla", "civ6-rnf", "civ6-gs", "civ6-frontier", "civ6-extra"] as const
export const CivGroups = [...Civ5CivGroups, ...Civ6CivGroups, "custom"] as const

export function stringToCivGroup(string: string): CivGroup | undefined {
    return CivGroups.find(cg => cg === string)
}

export type Civ5CivGroup = typeof Civ5CivGroups[number]
export type Civ6CivGroup = typeof Civ6CivGroups[number]
export type CivGroup = typeof CivGroups[number]