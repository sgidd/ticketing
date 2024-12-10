import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";

import { RequestValidaionError } from "../errors/request-validation-error";
import { BadRequestError } from "../errors/bad-request-error";
import { User } from "../models/user";
import { validateRequest } from "../middlewares/validate-request";

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
  validateRequest,
  async (req: Request, res: Response) => {
    //removing validation as adding validateRequest middleware
    // const errors = validationResult(req);
    // // console.log(errors);
    // if (!errors.isEmpty()) {
    //   //   res.status(400).send(errors.array());
    //   //   throw new Error("Invalid email or password");

    //   throw new RequestValidaionError(errors.array());
    // }

    const { email, password } = req.body;
    // console.log("Creating User...");
    // // throw new Error("Error connecting to database");
    // throw new DatabaseConnectionError();
    // res.send({});

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      //   console.log("Email in use");
      //   return res.send({});
      throw new BadRequestError("Email is use");
    }

    const user = User.build({ email, password });
    await user.save();

    //generate JWT token
    const userJwt = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_KEY!
    );

    console.log("jwt", userJwt);

    //store it on session object - thats how we set it in cookies
    // req.session.jwt = userJwt;
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

router.post("/hi", (req, res) => {
  console.log("hi");
  res.send("hi");
});

export { router as signupRouter };
