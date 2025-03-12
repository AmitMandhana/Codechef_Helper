function getPageDetails() {
    let pageTitle = document.title || "Unknown Page";
    let problemStatement = document.querySelector(".problem-statement")?.innerText || "Problem description not found.";
    let pageContent = problemStatement;

    return { title: pageTitle, content: pageContent };
}

function storeChatHistory(details) {
    let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    
    chatHistory.push({
        time: new Date().toISOString(),
        title: details.title,
        content: details.content
    });

    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}

function createChatbotUI() {
    if (document.getElementById("chatbot-container")) return;

    let chatContainer = document.createElement("div");
    chatContainer.id = "chatbot-container";
    chatContainer.style.position = "fixed";
    chatContainer.style.bottom = "100px"; // Moves it up from the bottom
    chatContainer.style.right = "50%"; // Centers it horizontally
    chatContainer.style.transform = "translateX(50%)"; // Adjusts position
    chatContainer.style.width = "350px";
    chatContainer.style.height = "450px";
    chatContainer.style.background = "white";
    chatContainer.style.border = "1px solid #ccc";
    chatContainer.style.borderRadius = "10px";
    chatContainer.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.2)";
    chatContainer.style.padding = "10px";
    chatContainer.style.overflowY = "auto";
    chatContainer.style.zIndex = "1000";

    let chatHeader = document.createElement("div");
    chatHeader.innerText = "CodeChef Helper Bot";
    chatHeader.style.background = "#4CAF50";
    chatHeader.style.color = "white";
    chatHeader.style.padding = "10px";
    chatHeader.style.textAlign = "center";
    chatHeader.style.borderTopLeftRadius = "10px";
    chatHeader.style.borderTopRightRadius = "10px";

    let closeBtn = document.createElement("button");
    closeBtn.innerText = "X";
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "5px";
    closeBtn.style.right = "10px";
    closeBtn.style.background = "red";
    closeBtn.style.color = "white";
    closeBtn.style.border = "none";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.padding = "5px";

    closeBtn.onclick = () => {
        document.body.removeChild(chatContainer);
    };

    chatHeader.appendChild(closeBtn);

    let chatMessages = document.createElement("div");
    chatMessages.id = "chat-messages";
    chatMessages.style.height = "300px";
    chatMessages.style.overflowY = "auto";
    chatMessages.style.marginBottom = "10px";
    chatMessages.style.padding = "5px";

    let chatInput = document.createElement("input");
    chatInput.id = "chat-input";
    chatInput.type = "text";
    chatInput.placeholder = "Ask something...";
    chatInput.style.width = "80%";
    chatInput.style.padding = "5px";
    chatInput.style.border = "1px solid #ccc";

    let chatSend = document.createElement("button");
    chatSend.innerText = "Send";
    chatSend.style.marginLeft = "5px";
    chatSend.style.padding = "5px";
    chatSend.style.border = "none";
    chatSend.style.background = "#4CAF50";
    chatSend.style.color = "white";
    chatSend.style.cursor = "pointer";

    chatSend.onclick = () => sendMessage(chatInput, chatMessages);

    chatContainer.appendChild(chatHeader);
    chatContainer.appendChild(chatMessages);
    chatContainer.appendChild(chatInput);
    chatContainer.appendChild(chatSend);
    document.body.appendChild(chatContainer);

    loadChatHistory(chatMessages);
}

function loadChatHistory(chatMessages) {
    let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    chatHistory.forEach(entry => {
        let messageDiv = document.createElement("div");
        messageDiv.innerText = `📌 ${entry.title}: ${entry.content.substring(0, 200)}...`;
        chatMessages.appendChild(messageDiv);
    });
}

async function sendMessage(inputElement, chatMessages) {
    let userMessage = inputElement.value.trim();
    if (!userMessage) return;

    let userDiv = document.createElement("div");
    userDiv.innerText = "You: " + userMessage;
    chatMessages.appendChild(userDiv);

    inputElement.value = "";

    let botDiv = document.createElement("div");
    botDiv.innerText = "Bot: Thinking...";
    chatMessages.appendChild(botDiv);

    let problemDetails = getPageDetails();
    storeChatHistory(problemDetails);

    try {
        let response = await fetch("http://localhost:3000/gemini", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: userMessage,
                pageTitle: problemDetails.title,
                pageContent: problemDetails.content
            })
        });

        let data = await response.json();
        botDiv.innerText = "Bot: " + data.reply;
    } catch (error) {
        botDiv.innerText = "Bot: Error fetching response.";
    }
}

window.onload = createChatbotUI;
