export class Ticket {
  constructor({ id, purchaseDateTime, purchaser, products, amount }) {
    this.id = id;
    this.code = this.id; //I use the same mongoID -asalvidio
    this.purchaseDateTime = purchaseDateTime;
    this.amount = amount;
    this.products = products;
    this.purchaser = purchaser;
  }
}
