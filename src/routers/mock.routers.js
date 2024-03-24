import { Router } from "express";
import { faker } from "@faker-js/faker";

const router = Router();

const mockThumbnailURL = () => {
  return faker.image.url();
};

const mockThumbnailURLs = (minAmount, maxAmount) => {
  const amount =
    Math.floor(Math.random() * (maxAmount - minAmount + 1)) + minAmount;

  const urls = [];
  for (let i = 0; i < amount; i++) {
    const url = mockThumbnailURL();
    urls.push(url);
  }
  return urls;

  return;
};

const mockProduct = () => {
  return {
    id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    code: faker.commerce.isbn(),
    stock: parseInt(faker.string.numeric()),
    status: faker.datatype.boolean(),
    category: faker.commerce.department(),
    thumbnails: mockThumbnailURLs(2, 5),
  };
};

const mockUser = () => {
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

router.get("/", (req, res) => {
  let mockedProducts = [];
  for (let i = 0; i < 100; i++) {
    mockedProducts.push(mockProduct());
  }
  res.send({ status: "successful", payload: mockedProducts });
});

router.get("/users", (req, res) => {
  let mockedUsers = [];
  for (let i = 0; i < 10; i++) {
    mockedUsers.push(generateUser());
  }
  res.send({ status: "successful", payload: mockedUsers });
});

export default router;
