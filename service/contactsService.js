import Contact from "./schemas/contactsSchema.js";

function getAllContactsFromDB() {
  return Contact.find();
}

function getSpecificContactFromDb(contactId) {
  return Contact.findById(contactId);
}

async function addContactToDB(newContact) {
  await Contact.validate(newContact);

  const alreadyExistingDoc = await Contact.findOne(newContact);

  if (alreadyExistingDoc) {
    return "contact already exists";
  }

  return Contact.create(newContact);
}

function removeContactFromDB(contactId) {
  return Contact.findByIdAndDelete(contactId);
}

function updateContactFromDB(contactId, update) {
  return Contact.findByIdAndUpdate(contactId, update, {
    new: true,
    runValidators: true,
  });
}

function updateStatusContactFromDB(contactId, statusUpdate) {
  return Contact.findByIdAndUpdate(
    contactId,
    { favorite: statusUpdate },
    { new: true, runValidators: true }
  );
}

const contactsService = {
  getAllContactsFromDB,
  getSpecificContactFromDb,
  addContactToDB,
  removeContactFromDB,
  updateContactFromDB,
  updateStatusContactFromDB,
};

export default contactsService;
