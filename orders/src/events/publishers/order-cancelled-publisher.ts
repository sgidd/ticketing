import {
  Publisher,
  Subjects,
  OrderCancelledEvent,
} from "@sgidd-tickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
