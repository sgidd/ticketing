import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: "concet",
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  return ticket;
};
it("fetches orders for a perticular user", async () => {
  //create 3 tickets
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();

  const userOneCookie = global.signin();
  const userTwoCookie = global.signin();
  //Create one order as User #1
  await request(app)
    .post("/api/orders")
    .set("Cookie", userOneCookie)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  //Create two orders for user #2
  const { body: orderOne } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwoCookie)
    .send({ ticketId: ticketTwo.id })
    .expect(201);
  const { body: orderTwo } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwoCookie)
    .send({ ticketId: ticketThree.id })
    .expect(201);

  //make request to get orders for user #2
  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", userTwoCookie)
    .expect(200);

  console.log(response.body);

  //make sure we only get orders for user#2
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
  expect(response.body[0].ticket.id).toEqual(ticketTwo.id);
  expect(response.body[1].ticket.id).toEqual(ticketThree.id);
});
