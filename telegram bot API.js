class TelegramBotExtension {
    constructor() {
        this.token = "";
        this.chatId = "";
        this.messageHandlers = [];
        this.pollingInterval = null;
    }

    getInfo() {
        return {
            id: 'telegramBot',
            name: 'Telegram Bot',
            menuIconURI: 'https://cdn.dribbble.com/userupload/22515003/file/original-bed70c3fcd37fc0a0a324ad3ab075cd3.jpg?resize=752x&vertical=center',
            color1: '#0088cc',
            color2: '#005577',
            color3: '#003f4f',
            blocks: [
                {
                    opcode: 'setToken',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'set bot token [token]',
                    arguments: {
                        token: {
                            type: Scratch.ArgumentType.STRING
                        }
                    }
                },
                {
                    opcode: 'whenMessageReceived',
                    blockType: Scratch.BlockType.HAT,
                    text: 'when a message is received [text]',
                    arguments: {
                        text: {
                            type: Scratch.ArgumentType.STRING
                        }
                    }
                },
                {
                    opcode: 'sendText',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'send text [text]',
                    arguments: {
                        text: {
                            type: Scratch.ArgumentType.STRING
                        }
                    }
                },
                {
                    opcode: 'sendImage',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'send image [url]',
                    arguments: {
                        url: {
                            type: Scratch.ArgumentType.STRING
                        }
                    }
                },
                {
                    opcode: 'sendAudio',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'send audio [url]',
                    arguments: {
                        url: {
                            type: Scratch.ArgumentType.STRING
                        }
                    }
                },
                {
                    opcode: 'sendVideo',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'send video [url]',
                    arguments: {
                        url: {
                            type: Scratch.ArgumentType.STRING
                        }
                    }
                },
                {
                    opcode: 'sendDocument',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'send document [url]',
                    arguments: {
                        url: {
                            type: Scratch.ArgumentType.STRING
                        }
                    }
                },
                {
                    opcode: 'deleteMessage',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'delete message [messageId]',
                    arguments: {
                        messageId: {
                            type: Scratch.ArgumentType.STRING
                        }
                    }
                },
                {
                    opcode: 'startPolling',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'start polling for messages',
                    arguments: {}
                },
                {
                    opcode: 'stopPolling',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'stop polling for messages',
                    arguments: {}
                },
                {
                    opcode: 'getChatMessages',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'get chat messages in JSON',
                }
            ]
        }
    }

    setToken({ token }) {
        this.token = token;
        console.log(`Bot token set: ${this.token}`);
    }

    whenMessageReceived({ text }) {
        this.messageHandlers.push(text);
    }

    startPolling() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
        }
        this.pollingInterval = setInterval(async () => {
            await this.checkForMessages();
        }, 2000);
    }

    stopPolling() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
        }
    }

    async checkForMessages() {
        if (!this.token) {
            console.error("No bot token set!");
            return;
        }
        const response = await fetch(`https://api.telegram.org/bot${this.token}/getUpdates`);
        const data = await response.json();
        if (data.ok && data.result.length > 0) {
            for (const update of data.result) {
                if (update.message && update.message.text) {
                    const messageText = update.message.text;
                    this.chatId = update.message.chat.id;
                    this.messageHandlers.forEach(handlerText => {
                        if (messageText == handlerText) {
                            Scratch.extensions.broadcast('whenMessageReceived', {
                                text: messageText
                            });
                        }
                    });
                }
            }
        }
    }

    async sendText({ text }) {
        if (!this.token || !this.chatId) {
            console.error("No bot token or chat ID set!");
            return;
        }
        const response = await fetch(`https://api.telegram.org/bot${this.token}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: this.chatId,
                text: text
            })
        });
        console.log(await response.json());
    }

    async sendImage({ url }) {
        if (!this.token || !this.chatId) {
            console.error("No bot token or chat ID set!");
            return;
        }
        const response = await fetch(`https://api.telegram.org/bot${this.token}/sendPhoto`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: this.chatId,
                photo: url
            })
        });
        console.log(await response.json());
    }

    async sendAudio({ url }) {
        if (!this.token || !this.chatId) {
            console.error("No bot token or chat ID set!");
            return;
        }
        const response = await fetch(`https://api.telegram.org/bot${this.token}/sendAudio`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: this.chatId,
                audio: url
            })
        });
        console.log(await response.json());
    }

    async sendVideo({ url }) {
        if (!this.token || !this.chatId) {
            console.error("No bot token or chat ID set!");
            return;
        }
        const response = await fetch(`https://api.telegram.org/bot${this.token}/sendVideo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: this.chatId,
                video: url
            })
        });
        console.log(await response.json());
    }

    async sendDocument({ url }) {
        if (!this.token || !this.chatId) {
            console.error("No bot token or chat ID set!");
            return;
        }
        const response = await fetch(`https://api.telegram.org/bot${this.token}/sendDocument`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: this.chatId,
                document: url
            })
        });
        console.log(await response.json());
    }

    async deleteMessage({ messageId }) {
        if (!this.token || !this.chatId) {
            console.error("No bot token or chat ID set!");
            return;
        }
        const response = await fetch(`https://api.telegram.org/bot${this.token}/deleteMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: this.chatId,
                message_id: messageId
            })
        });
        console.log(await response.json());
    }

    async getChatMessages() {
        if (!this.token) {
            console.error("No bot token set!");
            return;
        }
        const response = await fetch(`https://api.telegram.org/bot${this.token}/getUpdates`);
        const data = await response.json();
        return JSON.stringify(data.result);
    }
}

Scratch.extensions.register(new TelegramBotExtension());
