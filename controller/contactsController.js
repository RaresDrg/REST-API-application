import contactsService from "../service/contactsService.js";

async function listContacts(req, res, next) {
  try {
    const result = await contactsService.getAllContactsFromDB();

    if (!result) {
      res.json({ status: "success", code: 200, message: "No data", data: [] });
      return;
    }

    res.status(200).json({ status: "success", code: 200, data: result });
  } catch (error) {
    next(error);
  }
}

async function getContactById(req, res, next) {
  try {
    const { contactId } = req.params;
    const result = await contactsService.getSpecificContactFromDb(contactId);
    console.log(contactId);

    if (!result) {
      res.status(404).json({ code: 404, message: "Not found" });
      return;
    }

    res.status(200).json({ status: "succes", code: 200, data: result });
  } catch (error) {
    if (error.name === "CastError") {
      res
        .status(400)
        .json({ status: "error", code: 400, message: "invalid id value" });
      return;
    }

    next(error);
  }
}

async function addContact(req, res, next) {
  try {
    const newContact = { ...req.body };
    const result = await contactsService.addContactToDB(newContact);

    if (result === "contact already exists") {
      res.status(400).json({
        status: "failed",
        code: 400,
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
      res
        .status(400)
        .json({ status: "failed", code: 400, message: error.message });
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
      res
        .status(400)
        .json({ status: "error", code: 400, message: "invalid id value" });
      return;
    }

    next(error);
  }
}

async function updateContact(req, res, next) {
  try {
    const { contactId } = req.params;
    const update = { ...req.body };
    const result = await contactsService.updateContactFromDB(contactId, update);

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
      res
        .status(400)
        .json({ status: "error", code: 400, message: "invalid id value" });
      return;
    }

    if (error.name === "ValidationError") {
      res
        .status(400)
        .json({ status: "error", code: 400, message: error.message });
      return;
    }

    next(error);
  }
}

async function updateContactStatus(req, res, next) {
  try {
    const { contactId } = req.params;
    const { favorite: statusUpdate } = req.body;

    const statusIsValid =
      statusUpdate !== undefined &&
      (statusUpdate === true || statusUpdate === false);

    if (!statusIsValid) {
      res.status(400).json({
        status: "failed",
        code: 400,
        message:
          "favorite: => this field is required to be either: true or false",
      });
      return;
    }

    const result = await contactsService.updateStatusContactFromDB(
      contactId,
      statusUpdate
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
      res
        .status(400)
        .json({ status: "error", code: 400, message: "invalid id value" });
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
