import { OrderStatus, ExpirationCompleteEvent } from "@sgidd-tickets/common";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import { Order } from "../../../models/order";

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: "title",
    price: 10,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  const order = Order.build({
    // id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket,
    userId: "adshdh",
  });
  await order.save();

  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { msg, data, order, ticket, listener };
};

it("updates the order status to cancelled", async () => {
  const { msg, data, order, ticket, listener } = await setup();
  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id).populate("ticket");
  expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
});

it("emits order cancelled event", async () => {
  const { msg, data, order, ticket, listener } = await setup();
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(eventData.id).toEqual(order.id);
});

it("ack the msg", async () => {
  const { msg, data, order, ticket, listener } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
