export class Cart {
  constructor({ _id, products }) {
    this.id = _id;
    this.products = products;
  }

  totalQuantity = () => {
    let totalQuantity = 0;

    this.products.forEach((item) => {
      totalQuantity += item.quantity;
    });

    return totalQuantity;
  };

  totalAmount = () => {
    let totalAmount = 0;

    this.products.forEach((item) => {
      const quantity = item.quantity;
      const price = item.product.price;
      totalAmount += quantity * price;
    });

    return totalAmount;
  };
}
