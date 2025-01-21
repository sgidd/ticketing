import { Publisher, Subjects, TicketCreatedEvent } from "@sgidd-tickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketedCreated = Subjects.TicketedCreated; 
}
