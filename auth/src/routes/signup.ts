import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";

import { RequestValidaionError } from "../errors/request-validation-error";
import { DatabaseConnectionError } from "../errors/database-connection-error";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password msut be between 4 and 20 characters"),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      //   res.status(400).send(errors.array());
      //   throw new Error("Invalid email or password");

      throw new RequestValidaionError(errors.array());
    }

    const { email, password } = req.body;
    console.log("Creating User...");
    // throw new Error("Error connecting to database");
    throw new DatabaseConnectionError();
    res.send({});
  }
);

router.post("/hi", (req, res) => {
  console.log("hi");
  res.send("hi");
});

export { router as signupRouter };
