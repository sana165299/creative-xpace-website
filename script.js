function toggleChat() {
    const chatbot = document.getElementById("chatbotBox");

    if (chatbot.style.display === "flex") {
        chatbot.style.display = "none";
    } else {
        chatbot.style.display = "flex";
    }
}

async function sendMessage() {
    const input = document.getElementById("userInput");
    const message = input.value.trim();

    if (!message) return;

    addMessage(message, "user");
    input.value = "";

    try {
        const response = await fetch("https://creative-xpace-website.onrender.com/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message
            })
        });

        if (!response.ok) {
            addMessage("API error: " + response.status, "bot");
            return;
        }

        const data = await response.json();
        addMessage(data.reply || "No reply received from server", "bot");

    } catch (error) {
        console.error(error);
        addMessage("Server connection failed.", "bot");
    }
}

function addMessage(text, sender) {
    const chatMessages = document.getElementById("chatMessages");

    if (!chatMessages) return;

    const messageDiv = document.createElement("p");
    messageDiv.classList.add(sender === "user" ? "user-message" : "bot-message");
    messageDiv.innerText = text;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

const roomImageInput = document.getElementById("roomImage");

if (roomImageInput) {
    roomImageInput.addEventListener("change", function () {
        const file = this.files[0];
        const preview = document.getElementById("previewImage");
        const status = document.getElementById("uploadStatus");
        const fileNameText = document.getElementById("fileNameText");

        if (file) {
            preview.src = URL.createObjectURL(file);
            preview.style.display = "block";

            if (fileNameText) {
                fileNameText.innerHTML = "Selected image: " + file.name;
            }

            status.innerHTML = "✅ Image is ready. Now press Analyze Room.";
        }
    });
}

function analyzeRoomImage() {
    const imageInput = document.getElementById("roomImage");
    const resultBox = document.getElementById("aiResult");
    const status = document.getElementById("uploadStatus");

    if (!imageInput.files.length) {
        resultBox.innerHTML = "Please upload a room image first.";
        return;
    }

    status.innerHTML = "✅ Image uploaded successfully";

    resultBox.innerHTML = `
        <h3>AI Interior Suggestions</h3>

        <p><b>Style:</b> Modern Minimalist</p>

        <p><b>Furniture:</b> Add floating shelves, compact sofa, and warm wooden textures.</p>

        <p><b>Lighting:</b> Use pendant lighting and warm LED strips.</p>

        <p><b>Space Optimization:</b> Use wall-mounted storage to maximize open space.</p>

        <p><b>Recommended Colors:</b> Warm beige, matte white, walnut brown.</p>
    `;
}