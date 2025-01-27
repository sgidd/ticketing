import { Publisher, OrderCreatedEvent, Subjects } from "@sgidd-tickets/common";

export class OrderCreatedPubisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
