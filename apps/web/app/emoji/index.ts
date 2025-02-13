const emojis : string[] = ["👍", "❤️", "⭐", "🎉", "🏅"];

export class Emoji {
    private roomId : number
    private socket : WebSocket
    private emoji : string

    constructor(roomId : number, socket : WebSocket, emoji : string) {
        this.roomId = roomId
        this.socket = socket
        this.emoji = emoji
        this.initHandler();
    }

    initHandler(){
        this.socket.addEventListener("message", (e) => {
                const message = JSON.parse(e.data);
                if (message.type === "emoji") {
                    this.emoji = message.data;
                    this.displayEmoji();
                }
        });
    }

    setEmoji (emoji : string) {
        if (!emoji) return;
        switch (emoji) {
            case "Award":
                this.emoji = emojis[4]!
                break
            case "PartyPopper":
                this.emoji = emojis[3]!
                break
            case "Star":
                this.emoji = emojis[2]!
                break
            case "Heart":
                this.emoji = emojis[1]!
                break
            case "ThumbsUp":
                this.emoji = emojis[0]!
                break
            default:
                break
        }
    }

    sendEmoji () {
        if (!this.emoji || !this.socket) return;
        this.socket.send(JSON.stringify({
            roomId : this.roomId,
            type : "emoji",
            data : this.emoji
        }))
    }

    displayEmoji () {
        if (!this.emoji) return;
        console.log("displaying");
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

    destroy () {
        const flyingEmojis = document.querySelectorAll(".flying-emoji");
        flyingEmojis.forEach((emojiElement) => {
            emojiElement.remove();
        });
    }
}
