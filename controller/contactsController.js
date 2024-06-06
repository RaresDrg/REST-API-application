import contactsService from "../service/contactsService.js";
import utils from "../utils/utils.js";

async function listContacts(req, res, next) {
  try {
    const owner = req.user.id;
    const { page, limit, favorite } = req.query;

    let contactsList;

    if (favorite === "true" || favorite === "false") {
      contactsList = await contactsService.getFilteredContactsFromDB(
        owner,
        favorite
      );
    } else if (Number(page) && Number(limit)) {
      const skip = (page - 1) * limit;
      contactsList = await contactsService.getContactsPaginated(
        owner,
        skip,
        limit
      );
    } else {
      contactsList = await contactsService.getAllContactsFromDB(owner);
    }

    if (!contactsList || contactsList.length === 0) {
      res.json({ status: "success", code: 200, message: "No data", data: [] });
      return;
    }

    res.status(200).json({ status: "success", code: 200, data: contactsList });
  } catch (error) {
    next(error);
  }
}

async function getContactById(req, res, next) {
  try {
    const { contactId } = req.params;
    const result = await contactsService.getSpecificContactFromDb(contactId);

    if (!result) {
      res.status(404).json({ code: 404, message: "Not found" });
      return;
    }

    res.status(200).json({ status: "succes", code: 200, data: result });
  } catch (error) {
    if (error.name === "CastError") {
      utils.handleInvalidIdError(res);
      return;
    }

    next(error);
  }
}

async function addContact(req, res, next) {
  try {
    const owner = req.user.id;
    const { name, phone, email } = req.body;

    const newContact = { name, phone, email, owner };
    const result = await contactsService.addContactToDB(newContact);

    if (result === "contact already exists") {
      res.status(409).json({
        status: "failed",
        code: 409,
        message: "the contact you want to add, it already exists in db",
      });
      return;
    }

    res.status(201).json({
      status: "success",
      code: 201,
      message: "contact added to db",
      data: result,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      utils.handleValidationError(res, error.message);
      return;
    }

    next(error);
  }
}

async function removeContact(req, res, next) {
  try {
    const { contactId } = req.params;
    const result = await contactsService.removeContactFromDB(contactId);

    if (!result) {
      res.status(404).json({ code: 404, message: "Not found" });
      return;
    }

    res.status(200).json({
      status: "succes",
      code: 200,
      message: `Contact: ${result.name}, removed from db`,
    });
  } catch (error) {
    if (error.name === "CastError") {
      utils.handleInvalidIdError(res);
      return;
    }

    next(error);
  }
}

async function updateContact(req, res, next) {
  try {
    const { name, email, phone } = req.body;
    const hasValidFields = name || email || phone;

    if (!hasValidFields) {
      res.status(400).json({
        status: "failed",
        code: 400,
        message:
          "In order to update the contact, you must enter values for at least one of these fields: name, email or phone",
      });
      return;
    }

    const { contactId } = req.params;
    const updates = { ...req.body };
    const result = await contactsService.updateContactInDB(contactId, updates);

    if (!result) {
      res.status(404).json({ code: 404, message: "Not found" });
      return;
    }

    res.status(200).json({
      status: "succes",
      code: 200,
      message: "Contact updated",
      data: result,
    });
  } catch (error) {
    if (error.name === "CastError") {
      utils.handleInvalidIdError(res);
      return;
    }

    if (error.name === "ValidationError") {
      utils.handleValidationError(res, error.message);
      return;
    }

    next(error);
  }
}

async function updateContactStatus(req, res, next) {
  try {
    const { favorite } = req.body;
    const statusIsValid = favorite === true || favorite === false;

    if (!statusIsValid) {
      res.status(400).json({
        status: "failed",
        code: 400,
        message:
          "favorite: => this field is required to be either: true or false",
      });
      return;
    }

    const result = await contactsService.updateContactInDB(
      req.params.contactId,
      { favorite }
    );

    if (!result) {
      res.status(404).json({ code: 404, message: "Not found" });
      return;
    }

    res.status(200).json({
      status: "succes",
      code: 200,
      message: "Contact's status updated",
      data: result,
    });
  } catch (error) {
    if (error.name === "CastError") {
      utils.handleInvalidIdError(res);
      return;
    }

    next(error);
  }
}

const contactsController = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateContactStatus,
};

export default contactsController;
