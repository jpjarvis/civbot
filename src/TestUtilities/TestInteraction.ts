import {ChatInputCommandInteraction, Client, CommandInteractionOptionResolver, Message} from "discord.js";
import {anyString, instance, mock, when} from "@typestrong/ts-mockito";

export class TestInteraction {
    public output: string[] = []
    public value: ChatInputCommandInteraction;

    constructor(applyOptions: (options: CommandInteractionOptionResolver) => void) {
        let messageMock = mock(Message);
        let mockedInteraction = mock(ChatInputCommandInteraction);
        when(mockedInteraction.guildId).thenReturn("test-guild");
        when(mockedInteraction.reply(anyString())).thenCall(async (message: string) => {
            this.writeMessage(message);
            return instance(messageMock);
        });

        const mockedOptions = mock(CommandInteractionOptionResolver);
        applyOptions(mockedOptions);
        when(mockedInteraction.options).thenReturn(instance(mockedOptions));

        let mockedClient = mock(Client);
        when(mockedClient.application).thenReturn(null);
        when(mockedInteraction.client).thenReturn(instance(mockedClient));

        this.value = instance(mockedInteraction);
    }

    private writeMessage(message: string) {
        this.output = [...this.output, message];
    }

    public static createEmpty() {
        return new TestInteraction(() => {
        });
    }
}