import { Listener, OrderCreatedEvent, Subjects } from "@sgidd-tickets/common";
import { Message } from "node-nats-streaming";

import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { natsWrapper } from "../../nats-wrapper";
//above import is not ideal as we mock the import
//hence we make the client protected inside base listener to access here

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    //Find ticket that the order is trying to reserve
    const ticket = await Ticket.findById(data.ticket.id);

    //if no ticket , throw error
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    //mark the ticket as reserved by setting its orderId
    ticket.set({ orderId: data.id });

    //save the ticket
    await ticket.save();

    //publish event to keep the version in sync in other services
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
    });

    //ack the msg
    msg.ack();
  }
}
