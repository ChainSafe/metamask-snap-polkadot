interface Message {
  message: string;
  value: unknown;
}

export const messageCreator = (messages: Message[]): string =>
  messages.map(({ message, value }) => `${message} ${String(value)}`).join('\n');
