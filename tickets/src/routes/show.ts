import express, { Request, Response } from "express";

import { Ticket } from "../models/ticket";
import { NotFoundError } from "@sgidd-tickets/common";

const router = express.Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);

  //   if (!ticket) return res.status(404);
  if (!ticket) {
    throw new NotFoundError();
  }

  res.send(ticket); //status will be 200 by default
});

export { router as showTicketRouter };
