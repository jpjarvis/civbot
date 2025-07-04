import { DraftArguments } from "../Commands/Draft/DraftCommand";
import {Civ, CivId} from "../Civs/Civs";

export type UserSettings = {
    defaultDraftSettings: Partial<DraftArguments>;
    customCivs: string[];
    bannedCivs: CivId[];
};
