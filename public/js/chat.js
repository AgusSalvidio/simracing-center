const socket = io();

let userEmail;

Swal.fire({
  title: "Identifícate",
  input: "text",
  text: "Ingresá el email para identificarte en el chat",
  confirmButtonText: "Ingresar",
  confirmButtonColor: "#b61212",
  inputValidator: (value) => {
    return !value && "Necesitas ingresar el email de usuario para continuar.";
  },
  allowOutsideClick: false,
}).then((result) => {
  userEmail = result.value;
});

const chatBox = document.querySelector("#chatBox");

chatBox.addEventListener("keyup", (evt) => {
  if (evt.key === "Enter") {
    if (chatBox.value.trim().length > 0) {
      socket.emit("addMessageEvent", {
        userEmail,
        message: chatBox.value,
        timestamp: Date.now(),
      });
      chatBox.value = "";
    }
  }
});

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
