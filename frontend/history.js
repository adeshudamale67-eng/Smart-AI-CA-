// =============================
// AI CA Assistant History
// =============================

document.addEventListener("DOMContentLoaded", function () {

  const historyContainer =
    document.getElementById("historyContainer");

  const clearHistoryBtn =
    document.getElementById("clearHistoryBtn");


  // =============================
  // Load Chat History
  // =============================

  function loadHistory() {

    const savedChat =
      localStorage.getItem("ai-ca-chat");

    if (!savedChat) {

      showEmptyHistory();

      return;
    }


    // Create temporary container
    const tempDiv =
      document.createElement("div");

    tempDiv.innerHTML = savedChat;


    // Get all messages
    const messages =
      tempDiv.querySelectorAll(".message");


    if (messages.length === 0) {

      showEmptyHistory();

      return;
    }


    historyContainer.innerHTML = "";


    messages.forEach((message, index) => {

      const bubble =
        message.querySelector(".bubble");

      if (!bubble) return;


      const text =
        bubble.innerText.trim();


      if (!text) return;


      const historyItem =
        document.createElement("div");

      historyItem.className =
        "history-item";


      // Check whether message is from user or AI
      const isUser =
        message.classList.contains("user");


      if (isUser) {

        historyItem.innerHTML = `
          <h3>
            <i class="fa-solid fa-user"></i>
            You
          </h3>

          <p>
            ${text}
          </p>

          <div class="history-date">
            Chat Message
          </div>
        `;

      } else {

        historyItem.innerHTML = `
          <h3>
            <i class="fa-solid fa-robot"></i>
            AI CA Assistant
          </h3>

          <p>
            ${text}
          </p>

          <div class="history-date">
            AI Response
          </div>
        `;

      }


      historyContainer.appendChild(historyItem);

    });

  }


  // =============================
  // Empty History
  // =============================

  function showEmptyHistory() {

    historyContainer.innerHTML = `

      <div class="empty-history">

        <i class="fa-solid fa-clock-rotate-left"></i>

        <h3>No Chat History</h3>

        <p>
          Your previous AI conversations will appear here.
        </p>

      </div>

    `;

  }


  // =============================
  // Clear History
  // =============================

  clearHistoryBtn.addEventListener(
    "click",
    function () {

      const confirmClear =
        confirm(
          "Are you sure you want to clear your chat history?"
        );


      if (confirmClear) {

        localStorage.removeItem("ai-ca-chat");

        showEmptyHistory();

      }

    }
  );


  // Load history when page opens
  loadHistory();

});