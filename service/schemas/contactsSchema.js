import { Schema, model } from "mongoose";

const schema = new Schema(
  {
    name: {
      type: String,
      minlength: 3,
      required: [true, "=> this field is required"],
    },
    email: {
      type: String,
      match: [
        /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        "enter a valid email address",
      ],
      required: [true, "=> this field is required"],
    },
    phone: {
      type: String,
      minLength: [10, "=> should have 10 digits"],
      maxLength: [10, "=> should have 10 digits"],
      match: [/\d{10}/, "=> should only have digits"],
      required: [true, "=> this field is required"],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { versionKey: false }
);

const Contact = model("contact", schema);

export default Contact;
