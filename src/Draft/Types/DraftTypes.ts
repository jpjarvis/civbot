export type Draft = Map<string, string[]>

export type DraftError = "no-players" | "not-enough-civs"
export type DraftResult = {success: true, draft: Draft} | {success: false, error: DraftError}