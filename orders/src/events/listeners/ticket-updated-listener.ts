import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketUpdatedEvent } from "@sgidd-tickets/common";

import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  // data: { id: string; title: string; price: number; userId: string; }
  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    // const ticket = await Ticket.findOne({
    //   _id: data.id,
    //   version: data.version - 1,
    // });
    //above method is added to method to Ticket model findByEvent

    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.set({ title: data.title, price: data.price, userId: data.userId });
    await ticket.save();
    msg.ack();
  }
}
