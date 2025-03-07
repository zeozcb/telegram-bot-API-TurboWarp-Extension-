class TelegramBotExtension {
    constructor() {
        this.token = "";  // To store the bot token
        this.chatId = ""; // To store the chat ID from received messages
        this.messageHandlers = []; // Array to store message handlers
        this.pollingInterval = null; // For polling messages from Telegram
    }

    getInfo() {
        return {
            id: 'telegramBot',
            name: 'Telegram Bot',
            menuIconURI: 'https://example.com/bot-icon.svg', // Replace with a valid icon URL

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
        this.token = token; // Set the bot token when specified
        console.log(`Bot token set: ${this.token}`);
    }

    whenMessageReceived({ text }) {
        // Register message handler for a specific message
        this.messageHandlers.push(text);
    }

    startPolling() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
        }

        this.pollingInterval = setInterval(async () => {
            await this.checkForMessages();
        }, 2000); // Poll every 2 seconds
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

                    // Check if the received message matches any registered handler text
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

// Extend Scratch with the Telegram bot extension
Scratch.extensions.register(new TelegramBotExtension());