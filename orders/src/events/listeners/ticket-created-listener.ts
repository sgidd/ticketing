import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEvent } from "@sgidd-tickets/common";

import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  //   queueGroupName = "orders-service"; //whenever multiple instances of orders service running quegroupname makes sure only one of them receives the same event
  //it should same for one service across all listeners so adding const in one file and using throught orders service
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { id, title, price } = data;
    const ticket = Ticket.build({ id, title, price }); //this will create a new ticket with diff id than in the ticket service 
    //so to need to adjust it with the same id as ticket service in Ticket Model by adjusting build method
    await ticket.save();

    msg.ack();
  }
}
