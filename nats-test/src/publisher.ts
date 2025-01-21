import nats from "node-nats-streaming";

import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

console.clear();
const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  console.log("Publisher connected to nats");

  // const data = JSON.stringify({
  //   id: "123",
  //   title: "title",
  //   price: 20,
  // });

  // stan.publish("ticket:created", data, () => {
  //   console.log("Event Published");
  // });
  //commenting as part of custom publisher class

  const publisher = new TicketCreatedPublisher(stan);

  try {
    await publisher.publish({
      id: "123",
      title: "new Title",
      price: 100,
      userId: "user1",
    });
  } catch (err) {
    console.log(err);
  }
});
