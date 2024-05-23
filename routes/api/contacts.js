import express from "express";
import Joi from "joi";
import contactsService from "../../models/contacts.js";

const router = express.Router();

const contactsValidationSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  phone: Joi.string()
    .regex(/^[0-9]{10}$/)
    .messages({ "string.pattern.base": `phone number must have 10 digits.` })
    .required(),
});

router.get("/", async (req, res, next) => {
  try {
    const result = await contactsService.listContacts();

    if (result === "operation failed") {
      res.json({ status: "success", code: 204, message: "No data", data: [] });
      return;
    }

    res.status(200).json({ status: "succes", code: 200, data: result });
  } catch (error) {
    res.status(500).json({ message: `${error}` });
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contactsService.getContactById(contactId);

    if (result === "operation failed") {
      res.status(404).json({ code: 404, message: "Not found" });
      return;
    }

    res.status(200).json({ status: "succes", code: 200, data: result });
  } catch (error) {
    res.status(500).json({ message: `${error}` });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = contactsValidationSchema.validate(req.body);

    if (error) {
      res.status(400).json({ code: 400, message: error?.details[0].message });
      return;
    }

    const result = await contactsService.addContact(req.body);

    if (result === "operation failed") {
      res.status(403).json({ code: 403, message: "Contact already exists" });
      return;
    }

    res.status(201).json({ code: 201, message: "contact added", data: result });
  } catch (error) {
    res.status(500).json({ message: `${error}` });
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contactsService.removeContact(contactId);

    if (result === "operation failed") {
      res.status(404).json({ code: 404, message: "Not found" });
      return;
    }

    res.status(200).json({ code: 200, message: "contact deleted" });
  } catch (error) {
    res.status(500).json({ message: `${error}` });
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { error } = contactsValidationSchema.validate(req.body);

    if (error) {
      res.status(400).json({ code: 400, message: error?.details[0].message });
      return;
    }

    const { contactId } = req.params;
    const result = await contactsService.updateContact(contactId, req.body);

    if (result === "operation failed") {
      res.status(404).json({ code: 404, message: "Not found" });
      return;
    }

    res
      .status(200)
      .json({ code: 200, message: "contact updated", data: result });
  } catch (error) {
    res.status(500).json({ message: `${error}` });
  }
});

export default router;
