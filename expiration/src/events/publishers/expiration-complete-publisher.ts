import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from "@sgidd-tickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationCompelte = Subjects.ExpirationCompelte;
}
