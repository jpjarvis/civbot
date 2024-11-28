import {ChatInputCommandInteraction, Client, Message} from "discord.js";
import {anyString, instance, mock, when} from "@typestrong/ts-mockito";

export class TestInteraction {
    public output: string[] = []
    public value: ChatInputCommandInteraction;

    constructor() {
        let messageMock = mock(Message);
        let mockedInteraction = mock(ChatInputCommandInteraction);
        when(mockedInteraction.guildId).thenReturn("test-guild");
        when(mockedInteraction.reply(anyString())).thenCall(async (message: string) => {
            this.writeMessage(message);
            return instance(messageMock);
        });
        let mockedClient = mock(Client);
        when(mockedClient.application).thenReturn(null);
        when(mockedInteraction.client).thenReturn(instance(mockedClient));

        this.value = instance(mockedInteraction);
    }

    private writeMessage(message: string) {
        this.output = [...this.output, message];
    }
}