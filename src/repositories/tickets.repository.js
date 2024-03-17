import { Ticket } from "../dto/Ticket/Ticket.js";

export default class TicketRepository {
  constructor(ticketDao) {
    this.dao = ticketDao;
  }

  totalAmountFor = (aProductCollection) => {
    let totalAmount = 0;

    aProductCollection.forEach((item) => {
      const quantity = item.quantity;
      const price = item.product.price;
      totalAmount += quantity * price;
    });

    return totalAmount;
  };

  async addTicketWith(aProductCollection, aPurchaserEmail) {
    const totalAmount = this.totalAmountFor(aProductCollection);

    try {
      const ticket = new Ticket({
        id: null, //Made this way to later when recreating the object, set db ID. -asalvidio
        code: null,
        purchaser: aPurchaserEmail,
        amount: totalAmount,
      });
      return await this.dao.addTicket(ticket);
    } catch (error) {
      throw error;
    }
  }
}
