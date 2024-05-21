import fs from "fs/promises";
import { nanoid } from "nanoid";

const contactsPath = "./models/contacts.json";

async function listContacts() {
  const contacts = JSON.parse(await fs.readFile(contactsPath, "utf8"));

  if (contacts.length === 0) {
    return "operation failed";
  }

  return contacts;
}

async function getContactById(contactId) {
  const contacts = await listContacts();
  const specificContact = contacts.find((el) => el.id === contactId);

  if (!specificContact) {
    return "operation failed";
  }

  return specificContact;
}

async function removeContact(contactId) {
  const contacts = await listContacts();
  const removeContactIndex = contacts.findIndex((el) => el.id === contactId);

  if (removeContactIndex === -1) {
    return "operation failed";
  }

  contacts.splice(removeContactIndex, 1);

  await fs.writeFile(contactsPath, JSON.stringify(contacts));

  return "operation succeeded";
}

async function addContact(body) {
  const contacts = await listContacts();

  const existingContact = contacts.find(
    (el) =>
      el.name === body.name &&
      el.email === body.email &&
      el.phone === body.phone
  );

  if (existingContact) {
    return "operation failed";
  }

  const newContact = { id: nanoid(), ...body };

  contacts.push(newContact);

  await fs.writeFile(contactsPath, JSON.stringify(contacts));

  return newContact;
}

async function updateContact(contactId, body) {
  const contacts = await listContacts();

  const targetedContactIndex = contacts.findIndex((el) => el.id === contactId);

  if (targetedContactIndex === -1) {
    return "operation failed";
  }

  const updatedContact = { id: contactId, ...body };

  contacts.splice(targetedContactIndex, 1, updatedContact);

  await fs.writeFile(contactsPath, JSON.stringify(contacts));

  return updatedContact;
}

const contactsService = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};

export default contactsService;
