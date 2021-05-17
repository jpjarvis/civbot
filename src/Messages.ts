export default class Messages {
    public static get Help(): string {
        return `\`\`\`civbot draft [OPTIONS]
        Drafts 3 civs for each player in the voice channel. Additional options:
            - civs [NUMBER] : Change the number of civs for each player
            - ai [NUMBER] : Add a specified number of AI players
            - novoice : Don't include players from voice
            - lekmod : Include lekmod civs
            - lekmod-only : Only use lekmod civs (no vanilla)
        eg. civbot draft numcivs 5 ai 2
        Drafts a game with everyone in voice plus 2 AI, and everyone picks from 5 civs.\`\`\``
    }
    public static get Info(): string { return "Hi, I'm CivBot. Use me to draft civ games with `civbot draft`, it's all I'm good for. \nTo find out more about drafting games, try `civbot help`." }
    public static get DraftFailed(): string { return "Draft failed - no players found. Either join voice or set some AI." }
    public static get BadlyFormed(): string { return "Command is badly formed - see `civbot help` for guidance" }
    public static get NotInVoice(): string { return "You're not in voice, so I'll set `novoice` on for this draft." }
    public static get Wowser(): string { return "Wowser!" }
}