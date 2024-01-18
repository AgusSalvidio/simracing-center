const socket = io();

let userEmail;

Swal.fire({
  title: "Identifícate",
  input: "text",
  text: "Ingresá el email para identificarte en el chat",
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

socket.on("updateMessagesBoxEvent", (data) => {
  let messagesBox = document.querySelector("#messagesBox");
  let messages = "";
  data.forEach((message) => {
    messages += `<li>${message.userEmail} dice: ${message.message}</li>`;
  });
  messagesBox.innerHTML = messages;
});
