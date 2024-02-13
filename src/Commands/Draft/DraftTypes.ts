import {Civ} from "../../Civs/Civs";

export type Draft = DraftEntry[];

export type DraftEntry = {
    player: string;
    civs: Civ[];
};

export type DraftError = "no-players" | "not-enough-civs";
