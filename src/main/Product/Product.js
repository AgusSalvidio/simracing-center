export class Product {
  constructor({
    id,
    title,
    description,
    price,
    code,
    stock,
    category,
    thumbnails,
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.price = price;
    this.code = code;
    this.stock = stock;
    this.status = true;
    this.category = category;
    this.thumbnails = thumbnails;
  }
  /*In here should be the assertion to generate the product based on the atributes, raising
      an instance creation failed error message, that the manager should handle. But to comply with
      the exercise statement that call is made by the ProductManager itself. But should be more cleaner
      that the product class has that assertion responsability and the manager only recives products already 
      instanciated. -asalvidio
    */
}
