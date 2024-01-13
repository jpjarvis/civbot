export default class Messages {
    public static get NoPlayers(): string {
        return "Draft failed - no players found. Either join voice or set some AI.";
    }

    public static get NotEnoughCivs(): string {
        return "Draft failed - not enough civs to assign to the players. Either add more civ groups to your draft or decrease the number of civs per player.";
    }

    public static get GenericError(): string {
        return "Uh oh, something's gone wrong. It's probably Jack's fault.";
    }

    public static get Wowser(): string {
        return "Wowser!";
    }
}
