const generateUserErrorInfo = (user) => {
  return `One or more properties where incomplete or not valid.
    List of required properties:
    *firstName: has to be a string, received ${user.firstname}
    *lastname: has to be a string, received ${user.lastname}`;
};

export { generateUserErrorInfo };
