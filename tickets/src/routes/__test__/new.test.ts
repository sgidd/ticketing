import request from "supertest";

import { app } from "../../app";
import { Ticket } from "../../models/ticket";

import { natsWrapper } from "../../nats-wrapper";
//jest will still import the mocked natswrapper

it("has a route handler listeing to /api/tickets for post request", async () => {
  const response = await request(app).post("/api/tickets").send({});

  expect(response.statusCode).not.toEqual(404);
});

it("can only be accessed if user is signed in", async () => {
  const response = await request(app).post("/api/tickets").send({});

  expect(response.status).toEqual(401);

  //   or request(app).post("/api/tickets").send({}).expect(401)
});

it("returns status other than 401 if user is signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns an error if invalid title is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "",
      price: 10,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      //   title: "",
      price: 10,
    })
    .expect(400);
});

it("returns an error if invalid price is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "title",
      price: -10,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "title",
      //   price: "10",
    })
    .expect(400);
});

it("creates a ticket with valid inputs", async () => {
  let tickets = await Ticket.find({}); // empty object returns all records
  expect(tickets.length).toEqual(0);

  const title = "title1";
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title, price: 20 })
    .expect(201);

  tickets = await Ticket.find({});

  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(20);
  expect(tickets[0].title).toEqual(title);
});

it("publishes an create event", async () => {
  let tickets = await Ticket.find({}); // empty object returns all records
  expect(tickets.length).toEqual(0);

  const title = "title1";
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title, price: 20 })
    .expect(201);

  // console.log(natsWrapper);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
