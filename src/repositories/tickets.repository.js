import { Ticket } from "../dto/Ticket/Ticket.js";

export default class TicketRepository {
  constructor(ticketDao) {
    this.dao = ticketDao;
  }

  async addTicketWith(aCart, aPurchaserEmail) {
    try {
      const ticket = new Ticket({
        id: null, //Made this way to later when recreating the object, set db ID. -asalvidio
        code: null,
        purchaseDateTime: new Date(),
        purchaser: aPurchaserEmail,
        amount: aCart.totalAmount(),
      });
      return await this.dao.addTicket(ticket);
    } catch (error) {
      throw error;
    }
  }
}
