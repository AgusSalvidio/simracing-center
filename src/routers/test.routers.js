import { Router } from "express";
import { faker } from "@faker-js/faker";

const router = Router();

const generateProducts = () => {
  return {
    id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    price: faker.commerce.price(),
    department: faker.commerce.department(),
    stock: parseInt(faker.string.numeric()),
    description: faker.commerce.productDescription(),
    image: faker.image.url(),
  };
};

const generateUser = () => {
  let productsQuantity = parseInt(
    faker.string.numeric(1, { bannedDigits: ["0"] })
  );
  let mockedProducts = [];
  for (let i = 0; i < productsQuantity; i++) {
    mockedProducts.push(generateProducts());
  }
  return {
    id: faker.database.mongodbObjectId(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    birthdate: faker.date.birthdate(),
    phone: faker.phone.number(),
    image: faker.image.avatar(),
    email: faker.internet.email(),
    products: mockedProducts,
  };
};

router.get("/users", (req, res) => {
  let mockedUsers = [];
  for (let i = 0; i < 10; i++) {
    mockedUsers.push(generateUser());
  }
  res.send({ status: "successful", payload: mockedUsers });
});

export default router;
