import { TicketCreatedListener } from "../ticket-created-listener";
import { TicketCreatedEvent } from "@sgidd-tickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  //create an instance of listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  //create a fake data event or object
  const data: TicketCreatedEvent["data"] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  //create a fake message object which should implete act()
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};
it("creates and saves a ticket", async () => {
  const { listener, data, msg } = await setup();

  //call onMessage func with data obj and message obj above
  await listener.onMessage(data, msg);

  //write assertions to make sure a ticket was created
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket?.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  //call onMessage func with data obj and message obj above
  await listener.onMessage(data, msg);

  //write assertions to make sure ack() is called
  expect(msg.ack).toHaveBeenCalled();
});
