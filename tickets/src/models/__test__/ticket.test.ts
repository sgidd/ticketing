import { Ticket } from "../ticket";

it("implements Optimistic Concurrency Control", async () => {
  //create an instance of a ticket
  const ticket = Ticket.build({ title: "t1", price: 10, userId: "123" });

  //save the ticket to db
  await ticket.save();

  //fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  //make 2 separate changes to each ticket fetched
  firstInstance?.set({ price: 20 });
  secondInstance?.set({ price: 30 });

  //save the first ticket fetched
  await firstInstance?.save();

  //save the second ticket and expect an error
  //   await secondInstance?.save();
  //   expect(async ()=> {await secondInstance?.save()}).toThrow()

  try {
    await secondInstance?.save();
  } catch (error) {
    return;
  }

  throw new Error("shold not reach this point means it return in line 30");
});

it("increments version number on multiple saves", async () => {
  const ticket = Ticket.build({ title: "t1", price: 10, userId: "123" });

  //1st save
  await ticket.save();
  expect(ticket.version).toBe(0);

  //2nd save
  await ticket.save();
  expect(ticket.version).toBe(1);
});
