import {DraftArguments} from '../Commands/Draft/DraftCommand';

export default class UserData {
    defaultDraftSettings: Partial<DraftArguments> = {
        civGroups: [
            "civ5-vanilla"
        ]
    };
    customCivs: Array<string> = [];
}