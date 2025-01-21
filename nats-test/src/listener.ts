import nats, { Message, Stan } from "node-nats-streaming";
import { randomBytes } from "crypto";

import { TicketCreatedListener } from "./events/ticket-created-listener";

console.clear();

//2nd arg is client id
//stan is referred as client
const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listerner connected to NATS");

  stan.on("close", () => {
    console.log("NATS connection closed!");
    process.exit();
  });

  // const options = stan.subscriptionOptions().setManualAckMode(true);
  //removing as part abstract class implmentation

  //2nd arg is name of the queue group we want to join
  //so incase of multiple instance nats randmoly send one of the instance instead sending same copy to all instance
  // const subscription = stan.subscribe(
  //   "ticket:created",
  //   "order-service-queue-group",
  //   options
  // );
  //removing as part abstract class implmentation

  // subscription.on("message", (msg: Message) => {
  //   const data = msg.getData();
  //   if (typeof data === "string") {
  //     console.log(`Received event #${msg.getSequence()}, with data ${data}`);
  //   }

  //   msg.ack();
  // });
  //removing as part abstract class implmentation

  new TicketCreatedListener(stan).listen();
});

//graceful shutdown of nats streaming server on any interrupt or terminate
process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
