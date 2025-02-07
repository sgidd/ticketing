import { TicketUpdatedListener } from "../ticket-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from "mongoose";
import { TicketUpdatedEvent } from "@sgidd-tickets/common";
import { Message } from "node-nats-streaming";

import { Ticket } from "../../../models/ticket";

const setup = async () => {
  //Create a Listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  //Create and save ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "title",
    price: 10,
  });
  await ticket.save();

  //create a fake data obj -- this is the update event data so update the ticket title or price
  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: "new title",
    price: 11,
    userId: new mongoose.Types.ObjectId().toHexString(), // can be anything
  };

  //create a fake msg obj
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it("finds, updates and save a ticket", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket?.title).toEqual(data.title);
  expect(updatedTicket?.price).toEqual(data.price);
  expect(updatedTicket?.version).toEqual(data.version);
});

it("acks the message on update", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});

it("does not call ack if the event has a skipped version number", async () => {
  const { listener, data, msg, ticket } = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (err) {}
  expect(msg.ack).not.toHaveBeenCalled();
});
