import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";

it("returns an error if ticket does not exist", async () => {
  const ticketId = new mongoose.Types.ObjectId(); //generate random ticket id

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
      ticketId,
    })
    .expect(404);
});

it("returns an error if ticket is already reserved", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const order = Order.build({
    ticket,
    userId: "randomId",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  //now assert to book the same ticket above created which is reserved by above order

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
      ticketId: ticket.id,
    })
    .expect(400);
});

it("reservs a ticket", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
      ticketId: ticket.id,
    })
    .expect(201);
});

it.todo("emits an order created event");
