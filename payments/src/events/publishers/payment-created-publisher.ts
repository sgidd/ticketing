import {
  Subjects,
  Publisher,
  PaymentCreatedEvent,
} from "@sgidd-tickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
