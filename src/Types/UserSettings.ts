import {DraftArguments} from '../Commands/Draft/DraftCommand';

export default class UserSettings {
    defaultDraftSettings: Partial<DraftArguments> = {
        civGroups: [
            "civ5-vanilla"
        ]
    };
    customCivs: Array<string> = [];
}