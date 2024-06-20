import request from "supertest";
import express from "express";
import { jest } from "@jest/globals";
import mockingoose from "mockingoose";
import bcrypt from "bcrypt";

import usersRouter from "../routes/api/users.js";
import User from "../service/schemas/usersSchema.js";

const app = express();
app.use(express.json());
app.use("/api/users", usersRouter);

describe("User's routes", () => {
  afterEach(() => {
    mockingoose(User).reset();
  });

  test("Responds to: login", async () => {
    const bcryptCompareMock = jest.fn().mockResolvedValue(true);
    bcrypt.compareSync = bcryptCompareMock;

    mockingoose(User).toReturn(
      {
        email: "test@yahoo.com",
        subscription: "starter",
        id: "asfafs51445asf4a",
        verify: true,
      },
      "findOne"
    );

    const result = await request(app)
      .post("/api/users/login")
      .send({ email: "test@yahoo.com", password: "test" });

    expect(result.statusCode).toBe(200);
    expect(result.body.data).toHaveProperty("token");

    expect(result.body.data).toHaveProperty("user");
    expect(typeof result.body.data.user.email).toBe("string");
    expect(typeof result.body.data.user.subscription).toBe("string");
  });
});
