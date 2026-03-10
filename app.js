const API_KEY = "YOUR_GROQ_API_KEY";

const chat = document.getElementById("chat");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const voiceBtn = document.getElementById("voiceBtn");
const typing = document.getElementById("typing");

let history = [];

/* ADD MESSAGE TO CHAT */

function addMessage(role, text) {

const div = document.createElement("div");
div.className = `message ${role}`;

const avatar = document.createElement("div");
avatar.className = "avatar";
avatar.innerText = role === "ai" ? "AI" : "You";

const msg = document.createElement("div");
msg.className = "text";
msg.innerText = text;

div.appendChild(avatar);
div.appendChild(msg);

chat.appendChild(div);

chat.scrollTop = chat.scrollHeight;

}

/* SPEAK RESPONSE */

function speak(text) {

const speech = new SpeechSynthesisUtterance(text);
speech.lang = "en-IN";

speechSynthesis.speak(speech);

}

/* CALL GROQ API */

async function askAI(message) {

try {

history.push({ role: "user", content: message });

const response = await fetch(
"https://api.groq.com/openai/v1/chat/completions",
{
method: "POST",
headers: {
"Content-Type": "application/json",
Authorization: `Bearer ${API_KEY}`
},
body: JSON.stringify({
model: "llama-3.3-70b-versatile",
messages: [
{
role: "system",
content:
"You are Riverwood AI, a helpful assistant for Riverwood Projects. Answer questions about construction updates, pricing, and site visits."
},
...history
]
})
}
);

const data = await response.json();

if (!data.choices) {
console.log(data);
return "AI service error.";
}

const reply = data.choices[0].message.content;

history.push({ role: "assistant", content: reply });

return reply;

} catch (error) {

console.error(error);
return "Error connecting to AI.";

}

}

/* SEND MESSAGE */

async function sendMessage() {

const text = input.value.trim();

if (!text) return;

addMessage("user", text);

input.value = "";

typing.classList.remove("hidden");

const reply = await askAI(text);

typing.classList.add("hidden");

addMessage("ai", reply);

speak(reply);

}

/* QUICK BUTTONS */

function quickAsk(question) {

input.value = question;

sendMessage();

}

/* VOICE INPUT */

function startVoice() {

const SpeechRecognition =
window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
alert("Speech recognition not supported in this browser");
return;
}

const recognition = new SpeechRecognition();

recognition.lang = "en-IN";
recognition.start();

recognition.onresult = (event) => {

const transcript = event.results[0][0].transcript;

input.value = transcript;

sendMessage();

};

recognition.onerror = (event) => {
console.error("Voice error:", event.error);
};

}

/* BUTTON EVENTS */

sendBtn.addEventListener("click", sendMessage);

voiceBtn.addEventListener("click", startVoice);

/* ENTER KEY */

input.addEventListener("keypress", function(e) {

if (e.key === "Enter") {
sendMessage();
}

});

/* GREETING */

window.onload = function () {

const greeting =
"Namaste sir, chai pee li? I am Riverwood AI, your assistant for construction updates and site visits.";

addMessage("ai", greeting);

speak(greeting);

};
