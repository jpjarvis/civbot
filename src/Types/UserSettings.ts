import { DraftArguments } from "../Commands/Draft/DraftCommand";

export type UserSettings = {
    defaultDraftSettings: Partial<DraftArguments>;
    customCivs: string[];
    bannedCivs: string[];
};
