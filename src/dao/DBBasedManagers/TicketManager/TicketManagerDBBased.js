import { Ticket } from "../../../dto/Ticket/Ticket.js";
import ticketModel from "../models/ticket.model.js";

export class TicketManagerDBBased {
  async addTicket(aPotentialTicket) {
    try {
      await ticketModel.create(aPotentialTicket);
    } catch (error) {
      throw error;
    }
  }

  async getTickets() {
    try {
      const tickets = await ticketModel.find({});
      const parsedTickets = tickets.map((ticket) => new Ticket(ticket));
      return parsedTickets;
    } catch (error) {
      console.error(error.message);
    }
  }
}
