import Contact from "./schemas/contactsSchema.js";

function getAllContactsFromDB(owner) {
  return Contact.find({ owner });
}

function getContactsPaginated(owner, skip, limit) {
  return Contact.find({ owner }).skip(skip).limit(limit);
}

function getFilteredContactsFromDB(owner, favoriteFilter) {
  return Contact.find({ owner, favorite: favoriteFilter });
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

function updateContactInDB(contactId, updates) {
  return Contact.findByIdAndUpdate(contactId, updates, {
    new: true,
    runValidators: true,
  });
}

const contactsService = {
  getAllContactsFromDB,
  getContactsPaginated,
  getFilteredContactsFromDB,
  getSpecificContactFromDb,
  addContactToDB,
  removeContactFromDB,
  updateContactInDB,
};

export default contactsService;
