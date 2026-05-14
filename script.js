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
    const messages = document.getElementById("chatMessages");

    const userText = input.value.trim();

    if (userText === "") return;

    messages.innerHTML += `
        <p class="user-message">${userText}</p>
    `;

    input.value = "";

    try {

        const response = await fetch("http://127.0.0.1:5000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: userText
            })
        });

        const data = await response.json();

        messages.innerHTML += `
            <p class="bot-message">${data.reply}</p>
        `;

    } catch (error) {

        messages.innerHTML += `
            <p class="bot-message">Server connection failed.</p>
        `;

        console.log(error);
    }
}