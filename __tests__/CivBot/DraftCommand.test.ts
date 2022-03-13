import {DraftArguments, draftCommand} from "../../src/CivBot/DraftCommand";
import {CivGroup} from "../../src/Draft/Types/CivGroups";
import UserData from "../../src/CivBot/UserData";
import Messages from "../../src/CivBot/Messages";
import CivData from "../../src/Draft/CivData";
import {generateArray} from "../TestUtils";

function expectOutputDraftToHave(output: string[], civGroups: Set<CivGroup>, players: string[]) {
    expect(output[0]).toContain("Drafting for ")
    for (let c of civGroups) {
        expect(output[0]).toContain(c)
    }
    for (let p of players) {
        expect(output[1]).toContain(p)
    }
}

describe('draftCommand', () => {
    let output: string[] = []
    const writeOutput = (message: string) => {
        output.push(message)
    }

    beforeEach(() => {
        output = []
    })
    
    const userData: UserData = {
        defaultDraftSettings: {},
        customCivs: []
    }
    
    const civData: CivData = {
        civs: {
            "civ5-vanilla": generateArray(10),
            "lekmod": generateArray(10),
            "civ6-vanilla": generateArray(10),
            "civ6-rnf": generateArray(10),
            "civ6-gs": generateArray(10),
            "civ6-extra": generateArray(10),
            "civ6-frontier": generateArray(10)
        }
    }
    
    it('should display the draft correctly', async () => {
        const draftArgs: DraftArguments = {
            numberOfAi: 0,
            numberOfCivs: 3,
            noVoice: false,
            civGroups: ['civ5-vanilla', 'lekmod']
        }
        
        await draftCommand(draftArgs, ["player1", "player2", "player3"], writeOutput, userData, civData)

        expect(output[0]).toBe('Drafting for `civ5-vanilla`, `lekmod`')
        const regex = new RegExp("\`\`\`(player. *[^\/]* \/ [^\/]* \/ [^\/]*\n)+\`\`\`");
        expect(output[1]).toMatch(regex);
    });

    it('should display the correct error for no players', async () => {
        const draftArgs: DraftArguments = {
            numberOfAi: 0,
            numberOfCivs: 3,
            noVoice: true,
            civGroups: ['civ5-vanilla']
        }
        
        await draftCommand(draftArgs, [], writeOutput, userData, civData);
        expect(output[0]).toBe(Messages.NotInVoice)
        expect(output[1]).toBe(Messages.NoPlayers)
    });

    it('should display the correct error for not enough civs', async () => {
        const draftArgs: DraftArguments = {
            numberOfAi: 0,
            numberOfCivs: 100,
            noVoice: false,
            civGroups: ['civ5-vanilla']
        }

        await draftCommand(draftArgs, ["player1", "player2", "player3"], writeOutput, userData, civData);
        expect(output[0]).toBe(Messages.NotEnoughCivs)
    });
})