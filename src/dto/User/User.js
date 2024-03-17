export class User {
  constructor({ id, firstName, lastName, age, role, cart, email, password }) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
    this.role = role;
    this.cart = cart;
    this.email = email;
    this.password = password;
  }
}
