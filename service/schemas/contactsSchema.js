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
      minLength: [10, "phone number should have 10 digits"],
      maxLength: [10, "phone number should have 10 digits"],
      match: [/\d{10}/, "phone number should only have digits"],
      required: [true, "=> this field is required"],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false }
);

const Contact = model("contact", schema);

export default Contact;
