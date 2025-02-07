import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedEvent, OrderStatus } from "@sgidd-tickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

import { Ticket } from "../../../models/ticket";

const setup = async () => {
  //create a instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  //Create and save ticket
  const ticket = await Ticket.build({
    title: "title",
    price: 10,
    userId: "abcd",
  });
  await ticket.save();

  //Create a fake data object
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: "pqrs",
    expiresAt: "hhjg",
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  //Create a fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { msg, data, ticket, listener };
};

it("sets the orderId of the ticket", async () => {
  const { msg, data, ticket, listener } = await setup();
  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).toEqual(data.id);
});

it("acks the message", async () => {
  const { msg, data, listener } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});

it("publishes a ticket updated event", async () => {
  const { msg, data, ticket, listener } = await setup();
  await listener.onMessage(data, msg);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
  // @ts-ignore
  //   console.log(natsWrapper.client.publish.mock.calls);
  const ticketUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(data.id).toEqual(ticketUpdatedData.orderId);
});
