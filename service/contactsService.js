import Contact from "./schemas/contactsSchema.js";

function getAllContactsFromDB() {
  return Contact.find();
}

function getContactsPaginated(skip, limit) {
  return Contact.find().skip(skip).limit(limit);
}

function getFilteredContactsFromDB(favoriteFilter) {
  return Contact.find({ favorite: favoriteFilter });
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

function updateContactFromDB(contactId, updates) {
  return Contact.findByIdAndUpdate(contactId, updates, {
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
  getContactsPaginated,
  getFilteredContactsFromDB,
  getSpecificContactFromDb,
  addContactToDB,
  removeContactFromDB,
  updateContactFromDB,
  updateStatusContactFromDB,
};

export default contactsService;
