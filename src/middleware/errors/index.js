import { EErrors } from "../../../utils/errors/enums.js";

const { INSTANCE_CREATION_FAILED } = EErrors;

const errorHandler = (error, req, res, next) => {
  console.log(error);
  switch (error.code) {
    case INSTANCE_CREATION_FAILED:
      return res.send({ status: "failed", payload: error });
      break;
    default:
      return res.send({
        status: "failed",
        payload: `Unhandled error: ${error}`,
      });
      break;
  }
};

export { errorHandler };
