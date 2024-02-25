const socket = io();

function handleKeyUp(evt, userEmail) {
  if (evt.key === "Enter") {
    const chatBox = document.querySelector("#chatBox");
    if (chatBox.value.trim().length > 0) {
      socket.emit("addMessageEvent", {
        userEmail,
        message: chatBox.value,
        timestamp: Date.now(),
      });
      chatBox.value = "";
    }
  }
}

const formatDate = (timestamp) => {
  const date = new Date(parseInt(timestamp, 10));
  return date.toLocaleString();
};

socket.on("updateMessagesBoxEvent", (data) => {
  let messagesBox = document.querySelector("#messagesBox");
  let messages = "";
  data.forEach((message) => {
    messages += `<div class="chat-message left">
    <div class="message">
      <small class="message-author">
      ${message.userEmail}
      </small>
      <span class="message-date">
      ${formatDate(message.timestamp)}
      </span>
      <span class="message-content">
      ${message.message}
      </span>
    </div>
  </div>`;
  });
  messagesBox.innerHTML = messages;
});
