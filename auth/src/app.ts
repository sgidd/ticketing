import express from "express";
import { json } from "body-parser";
import "express-async-errors";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-route-error";

const app = express();
//as we are prxing the domein using ingress nginx
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false, // disable exncryption as token we save is already encrypted
    // secure: true, //cookie can be used only when user visting our application over https connection
    secure: process.env.NODE_ENV !== "test", //while asserting for Set-Cokkie will be always undefined ans supertest makes call using http not https hence condition added
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// app.all("*", () => {
//   throw new NotFoundError();
// });

//if async function call it is required to rely on next, once promise resolved it will call the next
// app.all("*", async (req, res, next) => {
//   next(new NotFoundError());
// });

//instead doing like above we can use package wchi watches on any async code to complete and respond upon - express-async-errors
//without express-async-errors below code will stuck on sending request and never completes
app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
