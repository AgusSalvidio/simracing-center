import { EErrors } from "../../../utils/errors/enums.js";

const {
  INSTANCE_CREATION_FAILED,
  OBJECT_ALREADY_INCLUDED,
  OBJECT_NOT_INCLUDED,
  INVALID_TYPE_ERROR,
} = EErrors;

const errorHandler = (error, req, res, next) => {
  switch (error.code) {
    case INSTANCE_CREATION_FAILED:
      return res.status(400).send({ status: "failed", payload: error });

    case OBJECT_ALREADY_INCLUDED:
      return res.status(409).send({ status: "failed", payload: error });

    case OBJECT_NOT_INCLUDED:
      return res.status(404).send({ status: "failed", payload: error });

    case INVALID_TYPE_ERROR:
      return res.status(400).send({ status: "failed", payload: error });
    default:
      return res.status(400).send({
        status: "failed",
        payload: `Unhandled error: ${error}`,
      });
  }
};

export { errorHandler };
