import mongoose from "mongoose";
import express, { Request, Response } from "express";
import {
  NotFoundError,
  requireAuth,
  validateRequest,
  OrderStatus,
  BadRequestError,
} from "@sgidd-tickets/common";
import { body } from "express-validator";

import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import { OrderCreatedPubisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("Ticket ID must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    //find the ticket the user trying to order
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError();
    }

    //make sure ticket is not reserved by any other order
    //run query to look at all orders. find an order where the ticket fetched above and order status is not cancelled
    // const existingOrder = await Order.findOne({
    //   ticket: ticket,
    //   status: {
    //     $in: [
    //       OrderStatus.Created,
    //       OrderStatus.AwaitingPayment,
    //       OrderStatus.Complete,
    //     ],
    //   },
    // });

    // if (existingOrder) {
    //   throw new BadRequestError("Ticket is already reserved!");
    // }
    // instead wring query logic like above in route handler move ito model inside ticket doc
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError("Ticket is already reserved!");
    }

    //calulate expiraion date for the the order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS); //adding 15 min

    //build the order and save it to db
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket: ticket,
    });

    await order.save();

    //publish an event saying that order was created
    new OrderCreatedPubisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(), //UTC timestamp so work with any timezone
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });
    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
