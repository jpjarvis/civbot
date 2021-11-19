import {draft} from "../src/Draft";

test('draft should draft the correct number of civs for each player', () => {
    let draftResult = draft(3, 3, ['civ1','civ2','civ3','civ4','civ5','civ6','civ7','civ8','civ9'])
    expect(draftResult.length).toBe(3)
    
    draftResult.forEach(playerDraft => {
        expect(playerDraft.length).toBe(3)
    })
})