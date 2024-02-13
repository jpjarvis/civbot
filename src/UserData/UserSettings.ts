import { DraftArguments } from "../Commands/Draft/DraftCommand";
import {Civ} from "../Civs/Civs";

export type UserSettings = {
    defaultDraftSettings: Partial<DraftArguments>;
    customCivs: string[];
    bannedCivs: Civ[];
};
