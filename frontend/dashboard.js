// =============================
// AI CA Assistant Dashboard JS
// =============================

const API_BASE_URL = "http://127.0.0.1:8000";


// Welcome Message
window.addEventListener("load", async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "index.html";
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      localStorage.removeItem("token");
      window.location.href = "index.html";
      return;
    }

    const user = await response.json();

    const welcomeMessage = document.getElementById("welcomeMessage");
    if (welcomeMessage) {
      welcomeMessage.textContent = `Welcome back, ${user.full_name}`;
    }

    const profileName = document.getElementById("profileName");
    if (profileName) {
      profileName.textContent = user.full_name;
    }

    const profileEmail = document.getElementById("profileEmail");
    if (profileEmail) {
      profileEmail.textContent = user.email;
    }

    const profileAvatar = document.getElementById("profileAvatar");
    if (profileAvatar) {
      profileAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=16a34a&color=fff`;
    }

    const chatUserName = document.getElementById("chatUserName");
    if (chatUserName) {
      chatUserName.textContent = user.full_name;
    }

    console.log("Logged in as", user.username);
    scrollToBottom();
  } catch (error) {
    console.error(error);
    localStorage.removeItem("token");
    window.location.href = "index.html";
  }
});


// =============================
// Sidebar Active Menu
// =============================
const menuItems = document.querySelectorAll(".sidebar nav a");

menuItems.forEach(item => {

  item.addEventListener("click", function (e) {

    menuItems.forEach(link =>
      link.classList.remove("active")
    );

    this.classList.add("active");

    const href = this.getAttribute("href");

    // Stop only empty links
    if (!href || href === "#") {
      e.preventDefault();
    }

  });

});



// =============================
// Chat Elements
// =============================

const chatMessages = document.querySelector(".chat-messages");

const chatInput = document.querySelector(".chat-input input");

const sendButton = document.querySelector(".chat-input button");

const newChatButton = document.querySelector(".new-chat-btn");



// =============================
// Send Message
// =============================

function sendMessage() {

  const message = chatInput.value.trim();

  if (message === "") return;

  const userMessage = document.createElement("div");

  userMessage.className = "message user";

  userMessage.innerHTML = `

        <div class="bubble">

            ${message}

        </div>

    `;

  chatMessages.appendChild(userMessage);

  chatInput.value = "";

  scrollToBottom();

}



// =============================
// Send Button
// =============================

sendButton.addEventListener("click", sendMessage);



// =============================
// Enter Key
// =============================

chatInput.addEventListener("keypress", function (e) {

  if (e.key === "Enter") {

    e.preventDefault();

    sendMessage();

  }

});



// =============================
// New Chat
// =============================

newChatButton.addEventListener("click", () => {

  if (confirm("Start a new chat?")) {

    chatMessages.innerHTML = `

        <div class="message ai">

            <div class="avatar">🤖</div>

            <div class="bubble">

                Hello 👋

                <br><br>

                I'm your AI CA Assistant.

                <br><br>

                How can I help you today?

            </div>

        </div>

        `;

  }

});



// =============================
// Auto Scroll
// =============================

function scrollToBottom() {

  chatMessages.scrollTop = chatMessages.scrollHeight;

}



// =============================
// Logout
// =============================

const logoutButton = document.querySelector(".logout-btn");

logoutButton.addEventListener("click", () => {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  }
});



// =============================
// Live Clock
// =============================

function updateTime() {

  const now = new Date();

  const options = {

    weekday: "long",

    month: "long",

    day: "numeric",

    year: "numeric"

  };

  document.title =
    "AI CA Assistant • " +
    now.toLocaleDateString("en-IN", options);

}

updateTime();

setInterval(updateTime, 60000);
// =============================
// Upload System
// =============================

const uploadArea = document.querySelector(".upload-area");
const browseButton = document.querySelector(".upload-area button");

// Create hidden file input
const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.multiple = true;
fileInput.accept = ".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg";
fileInput.style.display = "none";

document.body.appendChild(fileInput);


// =============================
// Browse Files
// =============================

browseButton.addEventListener("click", () => {
  fileInput.click();
});


// =============================
// Drag & Drop
// =============================

["dragenter", "dragover"].forEach(event => {

  uploadArea.addEventListener(event, e => {

    e.preventDefault();
    uploadArea.classList.add("dragging");

  });

});

["dragleave", "drop"].forEach(event => {

  uploadArea.addEventListener(event, e => {

    e.preventDefault();
    uploadArea.classList.remove("dragging");

  });

});

uploadArea.addEventListener("drop", e => {

  const files = e.dataTransfer.files;

  handleFiles(files);

});


// =============================
// Browse Input
// =============================

fileInput.addEventListener("change", () => {

  handleFiles(fileInput.files);

});


// =============================
// Handle Files
// =============================

function handleFiles(files) {
  if (files.length === 0) return;
  Array.from(files).forEach(file => {
    console.log("Uploading:", file.name);
    uploadFile(file);
  });
}

async function uploadFile(file) {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    await response.json();

    showNotification(`${file.name} uploaded successfully ✅`);
    addUploadedFile(file);
  } catch (error) {
    console.error("Upload error:", error);
    showNotification(`❌ Failed to upload ${file.name}`);
  }
}


// =============================
// Simulate Upload
// =============================



// =============================
// Uploaded File List
// =============================

function addUploadedFile(file) {

  let fileList = document.querySelector(".uploaded-files");

  if (!fileList) {

    fileList = document.createElement("div");

    fileList.className = "uploaded-files";

    fileList.style.marginTop = "20px";

    uploadArea.appendChild(fileList);

  }

  const fileItem = document.createElement("div");

  fileItem.style.display = "flex";
  fileItem.style.justifyContent = "space-between";
  fileItem.style.alignItems = "center";
  fileItem.style.padding = "10px";
  fileItem.style.marginTop = "10px";
  fileItem.style.background = "#f3f4f6";
  fileItem.style.borderRadius = "10px";

  const size = (file.size / 1024).toFixed(1);

  fileItem.innerHTML = `

        <div>

            📄 <strong>${file.name}</strong>

            <br>

            <small>${size} KB</small>

        </div>

        <button class="delete-file">

            ❌

        </button>

    `;

  fileItem.querySelector("button").addEventListener("click", () => {

    fileItem.remove();

    showNotification(`${file.name} removed`);

  });

  fileList.appendChild(fileItem);

}



// =============================
// Notifications
// =============================

function showNotification(message) {

  const notification = document.createElement("div");

  notification.innerText = message;

  notification.style.position = "fixed";
  notification.style.top = "25px";
  notification.style.right = "25px";
  notification.style.background = "#16a34a";
  notification.style.color = "white";
  notification.style.padding = "15px 22px";
  notification.style.borderRadius = "12px";
  notification.style.boxShadow = "0 8px 20px rgba(0,0,0,.2)";
  notification.style.zIndex = "9999";
  notification.style.opacity = "0";
  notification.style.transition = ".3s";

  document.body.appendChild(notification);

  setTimeout(() => {

    notification.style.opacity = "1";

  }, 100);

  setTimeout(() => {

    notification.style.opacity = "0";

    setTimeout(() => {

      notification.remove();

    }, 300);

  }, 3000);

}

// ======================================
// AI CHAT SYSTEM
// ======================================

// Save chat after every update
function saveChat() {

  localStorage.setItem(
    "ai-ca-chat",
    chatMessages.innerHTML
  );

}

// Restore previous chat

function loadChat() {

  const saved = localStorage.getItem("ai-ca-chat");

  if (saved) {

    chatMessages.innerHTML = saved;

    scrollToBottom();

  }

}

loadChat();



// ======================================
// Override Send Message
// ======================================

const originalSendMessage = sendMessage;

function showTyping() {
  const typing = document.createElement("div");

  typing.className = "message ai typing";

  typing.innerHTML = `
        <div class="avatar">🤖</div>
        <div class="bubble">Typing...</div>
    `;

  chatMessages.appendChild(typing);
  scrollToBottom();

  return typing;
}

sendMessage = async function () {
  const message = chatInput.value.trim();
  if (message === "") return;

  const userText = message;

  originalSendMessage();
  saveChat();

  const typing = showTyping();

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        message: userText
      })
    });

    typing.remove();

    if (!response.ok) {
      throw new Error("Failed to get AI response");
    }

    const data = await response.json();

    const aiMessage = document.createElement("div");
    aiMessage.className = "message ai";
    aiMessage.innerHTML = `
      <div class="avatar">🤖</div>
      <div class="bubble">${data.response.replace(/\n/g, "<br>")}</div>
    `;

    chatMessages.appendChild(aiMessage);
    scrollToBottom();
    saveChat();

  } catch (error) {
    typing.remove();

    const aiMessage = document.createElement("div");
    aiMessage.className = "message ai";
    aiMessage.innerHTML = `
      <div class="avatar">⚠️</div>
      <div class="bubble">Unable to contact the AI server. Please try again.</div>
    `;

    chatMessages.appendChild(aiMessage);
    scrollToBottom();
    saveChat();
    console.error(error);
  }
};



// ======================================
// Clear Chat
// ======================================

function clearChat() {

  if (confirm("Delete entire chat history?")) {

    localStorage.removeItem("ai-ca-chat");

    chatMessages.innerHTML = `

        <div class="message ai">

            <div class="avatar">

                🤖

            </div>

            <div class="bubble">

                Hello 👋

                <br><br>

                I'm your AI CA Assistant.

            </div>

        </div>

        `;

  }

}



// ======================================
// Add Clear Chat Button
// ======================================

const clearButton = document.createElement("button");

clearButton.innerText = "Clear Chat";

clearButton.style.marginLeft = "10px";

clearButton.style.background = "#ef4444";

clearButton.style.color = "white";

clearButton.style.padding = "10px 15px";

clearButton.style.borderRadius = "10px";

clearButton.onclick = clearChat;

document.querySelector(".card-header").appendChild(clearButton);



// ======================================
// Suggested Prompts
// ======================================

const suggestions = [

  "Explain GST",

  "How to file ITR?",

  "What is Tax Audit?",

  "Sections under 80C"

];

console.log("Suggested Prompts:");

suggestions.forEach(prompt => {

  console.log(prompt);

});

// =============================
// Generate AI Report
// =============================

const generateReportButton = document.querySelector(".generate-btn");

generateReportButton.addEventListener("click", async () => {

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login again.");
    return;
  }

  const uploadedFile = document.querySelector(".uploaded-files strong");

  if (!uploadedFile) {
    alert("Please upload a PDF first.");
    return;
  }

  const filename = uploadedFile.textContent.trim();

  generateReportButton.disabled = true;
  generateReportButton.innerHTML = "Generating Report...";

  try {

    const response = await fetch(
      `${API_BASE_URL}/generate-report?filename=${encodeURIComponent(filename)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || "Report generation failed");
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename.replace(/\.[^/.]+$/, "")}_AI_Report.pdf`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);

    showNotification("AI Report generated successfully ✅");

  } catch (error) {

    console.error("Report generation error:", error);

    alert("Unable to generate the report.\n\n" + error.message);

  } finally {

    generateReportButton.disabled = false;

    generateReportButton.innerHTML = `
      <i class="fa-solid fa-wand-magic-sparkles"></i>
      Generate Report
    `;

  }

});