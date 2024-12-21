import request from "supertest";

import { app } from "../../app";

// it("return 201 on sucessful signup", async () => {
//   return request(app)
//     .post("/api/users/signup")
//     .send({
//       email: "test@test.com",
//       password: "password",
//     })
//     .expect(201);
// });

// it("returns 400 with invalid email", async () => {
//   return request(app)
//     .post("/api/users/signup")
//     .send({
//       email: "test@testo",
//       password: "password",
//     })
//     .expect(400);
// });

// it("returns 400 with invalid password", async () => {
//   return request(app)
//     .post("/api/users/signup")
//     .send({
//       email: "test@test.com",
//       password: "p",
//     })
//     .expect(400);
// });

// it("returns 400 with missing email and password", async () => {
//   return request(app).post("/api/users/signup").send({}).expect(400);
// });

// it("disallows duplicate emails", async () => {
//   await request(app)
//     .post("/api/users/signup")
//     .send({
//       email: "test@test.com",
//       password: "password",
//     })
//     .expect(201);

//   await request(app)
//     .post("/api/users/signup")
//     .send({
//       email: "test@test.com",
//       password: "password",
//     })
//     .expect(400);
// });

it("sends a cookie after successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  console.log(response);
  expect(response.get("Set-Cookie")).toBeDefined();
});
