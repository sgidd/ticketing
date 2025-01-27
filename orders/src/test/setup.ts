import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";


declare global {
  var signin: () => string[];
}

jest.mock("../nats-wrapper");

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "asdf";
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks();
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = () => {
  // build a JWT payload {id, email}
  const payload = {
    // id: "1234",
    id: new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };
  //to create new user everytime we use this sign in adding dynamic id so user will be diff each time
  //to aseess same user in multiple requests, can store the cookie and use the same as reference
  //refer test "returns 401 if the user does not own the ticket" in update.test.ts

  //create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  //build the session object {jwt: my_jwt}
  const session = { jwt: token };

  //turn that session into json
  const sessionJSON = JSON.stringify(session);

  //take json and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  //return a string -cookie with encoded data
  return [`session=${base64}`];
};
