const emojis : string[] = ["👍", "❤️", "⭐", "🎉", "🏅"];

export class Emoji {
    private roomId : number
    private socket : WebSocket
    private emoji : string

    constructor(roomId : number, socket : WebSocket, emoji : string) {
        this.roomId = roomId
        this.socket = socket
        this.emoji = emoji
    }

    setEmoji (emoji : string) {
        switch (emoji) {
            case "Award":
                this.emoji = emojis[4]
                break
            case "PartyPopper":
                this.emoji = emojis[3]
                break
            case "Star":
                this.emoji = emojis[2]
                break
            case "Heart":
                this.emoji = emojis[1]
                break
            case "ThumbsUp":
                this.emoji = emojis[0]
                break
        }
    }

    displayEmoji () {
        if (!this.emoji) return;
        const emojiElement = document.createElement("div");
        emojiElement.textContent = this.emoji
        emojiElement.className = "flying-emoji"

        const startX = Math.random() * (window.innerWidth - 50);
        emojiElement.style.left = `${startX}px`;

        document.body.appendChild(emojiElement);

        emojiElement.addEventListener('animationend', () => {
            document.body.removeChild(emojiElement);
        });
    }
}
