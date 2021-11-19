import * as shuffle from 'shuffle-array';

export type Draft = Array<PlayerDraft>
export type PlayerDraft = Array<string>

export function draft(numberOfPlayers: number, civsPerPlayer: number, civs: string[]): Draft {
    shuffle(civs);
    let draft: Draft = [];
    for (let i = 0; i < numberOfPlayers; i++) {
        draft.push(civs.slice(i * civsPerPlayer, (i + 1) * civsPerPlayer));
    }

    return draft;
}