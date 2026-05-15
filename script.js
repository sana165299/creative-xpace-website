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

async function analyzeRoomImage() {

    const imageInput = document.getElementById("roomImage");
    const resultBox = document.getElementById("aiResult");

    if (!imageInput.files.length) {

        resultBox.innerHTML = "Please upload a room image first.";
        return;
    }

    resultBox.innerHTML = "Analyzing room with AI...";

    const formData = new FormData();

    formData.append("image", imageInput.files[0]);

    try {

        const response = await fetch(
            "https://creative-xpace-website.onrender.com/analyze-room",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();

        resultBox.innerHTML = `
            <h3>AI Interior Suggestions</h3>
            <p>${data.reply}</p>
        `;

    } catch (error) {

        console.error(error);

        resultBox.innerHTML = "AI analysis failed.";
    }
}