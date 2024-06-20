import { Schema, model } from "mongoose";

const schema = new Schema(
  {
    email: {
      type: String,
      match: [
        /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        "enter a valid email address",
      ],
      required: [true, "=> this field is required"],
      unique: true,
    },
    password: {
      type: String,
      match: [
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,1024}$/,
        "=> minium length is 8 and it should contain at least: one digit, one lower case, one upper case, one special character",
      ],
      required: [true, "=> this field is required"],
    },
    subscription: {
      type: String,
      enum: {
        values: ["starter", "pro", "business"],
        message: "=> is either: starter, pro or business",
      },
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
      default: null,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: null,
    },
  },
  { versionKey: false }
);

const User = model("user", schema);

export default User;
