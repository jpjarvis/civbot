export type Draft = DraftEntry[]

export type DraftEntry = {
    player: string,
    civs: string[]
}

export type DraftError = "no-players" | "not-enough-civs"