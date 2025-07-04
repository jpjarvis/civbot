import {CivId} from "../../Civs/Civs";

export type Draft = DraftEntry[];

export type DraftedCiv = { custom: false, id: CivId } | { custom: true, name: string };

export type DraftEntry = {
    player: string;
    civs: DraftedCiv[];
};

export type DraftError = "no-players" | "not-enough-civs" | "not-enough-coastal-civs";
