import {assignCivs} from "../src/AssignCivs";

function generateArray(count: number): string[] {
    return Array.from(Array(count)).map((_,i) => `item${i}`)
}

describe('assignCivs', () => {
    test('should draft the right number of civs for all players',() => {
        const players = generateArray(3)
        const draft = assignCivs(players, 3, generateArray(50));
        
        for (const player of players) {
            console.log(player)
            expect(draft[player]).toHaveLength(3)
        }
    })
})