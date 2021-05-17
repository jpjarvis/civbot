export default class Messages {
    public static get Help(): string {
        return `\`\`\`civbot draft [OPTIONS]
        Drafts 3 civs from Civ 5 for each player in the voice channel. 
        Additional options:
            - civs [NUMBER] : Change the number of civs for each player
            - ai [NUMBER] : Add a specified number of AI players
            - novoice : Don't include players from voice
            - lekmod : Include lekmod civs (only with Civ 5)
            - lekmod-only : Only use lekmod civs (no vanilla) (only with Civ 5)
            - civ6 : Draft for Civ 6 instead of Civ 5, and include vanilla civ6 civs
            - r&f : Include civs from Rise and Fall (only with civ6)
            - gs : Include civs from Gathering Storm (only with civ6)
            - frontier : Include civs from the New Frontier Pass (only with civ6)
            - extra : Include the standalone DLC civs (only with civ6)
            - custom : Include user-defined custom civs - see 'civbot civs'
        eg. civbot draft civs 5 ai 2
        Drafts a game for Civ 5 with everyone in voice plus 2 AI, and everyone picks from 5 civs.
            civbot draft civ6 gs custom
        Drafts a game for Civ 6 with the Gathering Storm civs and any custom civs you've defined.
        
civbot civs [COMMAND]
        Manages the list of custom civs to be used when the 'custom' flag is passed to 'civbot draft'. 
        This list is global for your Discord server, and the custom civs can be used in both Civ 5 and Civ 6 drafts.
        Subcommands:
            - add [CIVS...] : Adds civs to the custom civs list. [CIVS...] is a space-separated list of names.
                eg. civbot civs add Nopon HighEntia
                (Currently civ names with spaces are not supported)
            - clear : Deletes all of the custom civs.
            - show : Shows the custom civs list.
        \`\`\``
    }
    public static get Info(): string { return "Hi, I'm CivBot. Use me to draft civ games with `civbot draft`, it's all I'm good for. \nTo find out more about drafting games, try `civbot help`." }
    public static get DraftFailed(): string { return "Draft failed - no players found. Either join voice or set some AI." }
    public static get BadlyFormed(): string { return "Command is badly formed - see `civbot help` for guidance" }
    public static get NotInVoice(): string { return "You're not in voice, so I'll set `novoice` on for this draft." }
    public static get AddedCustomCivs(): string { return "Custom civs added. Add the `custom` flag to your draft to use them." }
    public static get ClearedCustomCivs(): string { return "All custom civs deleted." }
    public static get NoCustomCivs(): string { return "You don't have any custom civs. You can add them with `civbot civs add`." }
    public static get GenericError(): string { return "Uh oh, something's got wrong. It's probably Jack's fault." }
    public static get Wowser(): string { return "Wowser!" }
}