import {assignCivs} from "../src/AssignCivs";
import {generateArray} from "./TestUtils";

describe('assignCivs', () => {
    it('should draft the right number of civs for all players',() => {
        const players = generateArray(3)
        const draft = assignCivs(players, 3, generateArray(50));
        
        for (const player of players) {
            console.log(player)
            expect(draft[player]).toHaveLength(3)
        }
    })
})