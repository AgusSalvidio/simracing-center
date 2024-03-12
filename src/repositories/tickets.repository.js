export default class TicketRepository {
  constructor(ticketDao) {
    this.dao = ticketDao;
  }

  async addTicket(aPotentialTicket) {
    try {
      await this.dao.addTicket(aPotentialTicket);
    } catch (error) {
      throw error;
    }
  }
}
