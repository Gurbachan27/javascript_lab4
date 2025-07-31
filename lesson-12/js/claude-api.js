// Your original code (unchanged, pasted fully for clarity)
// HELPER: Available API Endpoints
// Base URL: https://georgian.polaristechservices.com

const { message } = require("prompt");

/* CLAUDE API ENDPOINTS */
// 1. POST /api/claude/messages - Send message to Claude
//    Headers: X-Student-API-Key: your_student_id, Content-Type: application/json
//    Body: { model: "claude-3-5-sonnet-20241022", max_tokens: 100, messages: [{ role: "user", content: "your message" }] }
//    Response: { content: [{ text: "Claude's response" }], usage: { input_tokens: 10, output_tokens: 20 } }

// 2. GET /api/claude/status - Check token usage
//    Headers: X-Student-API-Key: your_student_id
//    Response: { student_id: "12345", student_name: "John Doe", tokens_used: 500, tokens_allocated: 10000, tokens_remaining: 9500, is_enabled: true }

// STEP 1: Store the API configuration
// STEP 2: Set the base URL for the Claude API
const baseURL = "https://georgian.polaristechservices.com/api/claude/";
// STEP 3: Set your student API key (student ID)
const studentApiKey = "200575736";
// STEP 4: Set the maximum tokens for API requests
const maxTokens = 1000;

/* STEP 5: Reference the DOM elements you'll need to access */
const userMessage = document.querySelector("#user-message");
const sendMessageBtn = document.querySelector("#send-message");
const checkUsageBtn = document.querySelector("#check-usage");
const results = document.querySelector("#results");

/* STEP 6: Add event listeners for all interactive elements */
// STEP 6a: Send message button
sendMessageBtn.addEventListener("click", sendChatMessage);

// STEP 6b: Check usage button
checkUsageBtn.addEventListener("click", checkTokenUsage);

/* STEP 7: Create the checkTokenUsage function */
function checkTokenUsage() {
    // STEP 7a: Create complete url
    let url = `${baseURL}/status`;
    console.log(url);
    // STEP 7b: Request status from the API
    fetch(url, {
        headers: {
            "X-Student-API-Key": studentApiKey
        } // STEP 7c: Handle the response
    }).then(res => {
        return res.json();
    }).then(json => {
        displayStatus(json);
    })
}

function displayStatus(responseJson) {
    console.log(responseJson);
    // STEP 7d: Display to user
    let pre = document.createElement("pre"); //<pre></pre>
    pre.textContent = `Enabled: ${responseJson.is_enabled}
Last Used: ${responseJson.last_used_at || "N/A"}
Student ID: ${responseJson.student_id}
Name: ${responseJson.student_name}
Tokens Allocated: ${responseJson.tokens_allocated}
Tokens Remaining: ${responseJson.tokens_remaining}
Tokens Used: ${responseJson.tokens_used || "N/A"}`;

    results.appendChild(pre);
}

/* LAB EXTENSION: Multi-Message Chat Feature */
/* LAB STEP 1: Modify sendChatMessage to use conversation history */
let conversationHistory = [];

function sendChatMessage() {
    let userInput = userMessage.value.trim();
    if (!userInput) return;

    // Add user message to conversation history
    conversationHistory.push({ role: "user", content: userInput });

    // Clear input box
    userMessage.value = "";

    // Prepare API request body with entire conversation history
    let url = `${baseURL}/messages`;

    fetch(url, {
            method: "POST",
            headers: {
                "X-Student-API-Key": studentApiKey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "claude-3-5-sonnet-20241022",
                "max_tokens": maxTokens,
                messages: conversationHistory
            })
        }).then(response => response.json())
        .then(json => {
            // Extract Claude's response text
            let claudeResponse = json.content && json.content[0] && json.content[0].text ? json.content[0].text : "No response";

            // Add Claude's response to conversation history
            conversationHistory.push({ role: "assistant", content: claudeResponse });

            // Display updated conversation
            displayConversation();
        }).catch(err => {
            console.error("Error communicating with Claude API:", err);
        });
}

/* LAB STEP 2: Update the displayResult function for chat-like appearance */
function displayConversation() {
    // Clear previous results
    results.innerHTML = "";

    conversationHistory.forEach(msg => {
        let div = document.createElement("div");
        div.textContent = msg.content;

        if (msg.role === "user") {
            div.style.backgroundColor = "#d1e7dd"; // light green for user
            div.style.textAlign = "right";
            div.style.padding = "8px";
            div.style.margin = "5px";
            div.style.borderRadius = "10px";
            div.style.maxWidth = "60%";
            div.style.marginLeft = "40%";
            div.style.fontWeight = "bold";
        } else {
            div.style.backgroundColor = "#f8d7da"; // light red for Claude
            div.style.textAlign = "left";
            div.style.padding = "8px";
            div.style.margin = "5px";
            div.style.borderRadius = "10px";
            div.style.maxWidth = "60%";
            div.style.fontWeight = "normal";
        }

        results.appendChild(div);
    });

    // Scroll to bottom
    results.scrollTop = results.scrollHeight;
}