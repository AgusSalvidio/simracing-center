export class Message {
  constructor({ id, userEmail, message, timestamp }) {
    this.id = id;
    this.userEmail = userEmail;
    this.message = message;
    this.timestamp = timestamp;
  }
}
