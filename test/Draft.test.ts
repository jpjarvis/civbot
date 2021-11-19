import {DraftArguments, executeDraft} from "../src/Draft";

test('draft should work', async () => {
    const draftArgs: DraftArguments = {
        numberOfAi: 3,
        numberOfCivs: 3,
        noVoice: true,
        civGroups: ["civ5-vanilla"]
    };
    
    const draftResult = await executeDraft(draftArgs, undefined, "")
    expect(draftResult.success)
})