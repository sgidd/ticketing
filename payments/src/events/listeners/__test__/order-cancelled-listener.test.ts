import { OrderCancelledListener } from "../order-cancelled-listener";
import mongoose from "mongoose";
import { OrderCancelledEvent, OrderStatus } from "@sgidd-tickets/common";
import { Message } from "node-nats-streaming";

import { natsWrapper } from "../../../nats-wrapper";
import { Order } from "../../../models/order";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 10,
    userId: "ahjd",
    version: 0,
  });
  await order.save();

  const data: OrderCancelledEvent["data"] = {
    id: order.id,
    version: order.version + 1,
    ticket: {
      id: "hhhjh",
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, data, msg };
};

it("updates the status of order", async () => {
  const { listener, data, order, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
});

it("acks msg", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
