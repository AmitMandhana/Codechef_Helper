document.getElementById("openChatbot").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: () => {
                if (document.getElementById("chatbot-container")) return;

                let chatContainer = document.createElement("div");
                chatContainer.id = "chatbot-container";
                chatContainer.style.position = "fixed";
                chatContainer.style.bottom = "20px";
                chatContainer.style.right = "20px";
                chatContainer.style.width = "300px";
                chatContainer.style.height = "400px";
                chatContainer.style.background = "white";
                chatContainer.style.border = "1px solid #ccc";
                chatContainer.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.2)";
                chatContainer.style.padding = "10px";
                chatContainer.style.overflowY = "auto";

                let chatHeader = document.createElement("div");
                chatHeader.innerText = "CodeChef Helper Bot";
                chatHeader.style.background = "#4CAF50";
                chatHeader.style.color = "white";
                chatHeader.style.padding = "5px";
                chatHeader.style.textAlign = "center";

                let chatMessages = document.createElement("div");
                chatMessages.id = "chat-messages";
                chatMessages.style.height = "300px";
                chatMessages.style.overflowY = "auto";
                chatMessages.style.marginBottom = "10px";

                let chatInput = document.createElement("input");
                chatInput.id = "chat-input";
                chatInput.type = "text";
                chatInput.placeholder = "Ask something...";
                chatInput.style.width = "80%";

                let chatSend = document.createElement("button");
                chatSend.innerText = "Send";
                chatSend.onclick = async () => {
                    let userMessage = chatInput.value.trim();
                    if (!userMessage) return;
                    
                    let userDiv = document.createElement("div");
                    userDiv.innerText = "You: " + userMessage;
                    chatMessages.appendChild(userDiv);

                    chatInput.value = "";

                    let botDiv = document.createElement("div");
                    botDiv.innerText = "Bot: Thinking...";
                    chatMessages.appendChild(botDiv);

                    try {
                        let response = await fetch("http://localhost:3000/gemini", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ message: userMessage })
                        });

                        let data = await response.json();
                        botDiv.innerText = "Bot: " + data.reply;
                    } catch (error) {
                        botDiv.innerText = "Bot: Error fetching response.";
                    }
                };

                let closeBtn = document.createElement("button");
                closeBtn.innerText = "X";
                closeBtn.style.position = "absolute";
                closeBtn.style.top = "5px";
                closeBtn.style.right = "5px";
                closeBtn.style.background = "red";
                closeBtn.style.color = "white";
                closeBtn.style.border = "none";
                closeBtn.style.cursor = "pointer";

                closeBtn.onclick = () => {
                    document.body.removeChild(chatContainer);
                };

                chatContainer.appendChild(chatHeader);
                chatContainer.appendChild(chatMessages);
                chatContainer.appendChild(chatInput);
                chatContainer.appendChild(chatSend);
                chatContainer.appendChild(closeBtn);

                document.body.appendChild(chatContainer);
            }
        });
    });
});
