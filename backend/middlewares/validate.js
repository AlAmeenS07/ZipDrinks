import { BAD_REQUEST } from "../utils/constants.js";

export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(BAD_REQUEST).json({
      success: false,
      message: error.details[0].message
    });
  }

  next();
};
