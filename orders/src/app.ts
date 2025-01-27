import express from "express";
import { json } from "body-parser";
import "express-async-errors";
import cookieSession from "cookie-session";
import {
  NotFoundError,
  errorHandler,
  currentUser,
} from "@sgidd-tickets/common";

import { indexOrderRouter } from "./routes";
import { newOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";
import { deleteOrderRouter } from "./routes/delete";

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
app.use(currentUser);

app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrderRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
