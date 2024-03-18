const generateUserErrorInfo = (user) => {
  return `One or more properties where incomplete or not valid.
    List of required properties:
    *firstName: has to be a string, received ${user.firstname}
    *lastname: has to be a string, received ${user.lastname}`;
};
const generateProductErrorInfo = (product) => {
  return {
    errorInfo: "One or more properties where incomplete or not valid.",
    requiredProperties: [
      `title: has to be a string.         Received: ${product.title}`,
      `description: has to be a string.   Received: ${product.description}`,
      `price: has to be a number.         Received:${product.price}`,
      `code: has to be a string.          Received: ${product.code}`,
      `stock: has to be a number.         Received: ${product.stock}`,
      `category: has to be a string.      Received: ${product.category}`,
    ],
  };
};

const generateObjectAlreadyIncludedErrorInfo = (anObjectID) => {
  return `An object already exists with the code ${anObjectID}`;
};

const generateObjectNotIncludedErrorInfo = () => {
  return "Object not found";
};

const generateInvalidTypeErrorInfo = () => {
  return "Invalid type error";
};

export {
  generateUserErrorInfo,
  generateProductErrorInfo,
  generateObjectAlreadyIncludedErrorInfo,
  generateObjectNotIncludedErrorInfo,
  generateInvalidTypeErrorInfo,
};
