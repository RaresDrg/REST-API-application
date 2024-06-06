import User from "./schemas/usersSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function addUsertoDB(data) {
  await User.validate(data);

  const alreadyExistingDoc = await User.findOne({ email: data.email });
  if (alreadyExistingDoc) {
    return "user already exists";
  }

  const salt = bcrypt.genSaltSync(10);
  const encryptedPassword = bcrypt.hashSync(data.password, salt);

  const newUser = {
    email: data.email,
    password: encryptedPassword,
  };

  return User.create(newUser);
}

async function checkUserInDB(data) {
  const user = await User.findOne({ email: data.email });
  if (!user) {
    return "email is wrong";
  }

  const decryptedPassword = bcrypt.compareSync(data.password, user.password);
  if (!decryptedPassword) {
    return "password is wrong";
  }

  return user;
}

async function addUserToken(data) {
  const { email, subscription, id } = data;

  const paylaod = { email, subscription, id };
  const secret = process.env.JWT_SECRET;
  const token = jwt.sign(paylaod, secret, { expiresIn: "1h" });

  await User.findByIdAndUpdate(data.id, { token });

  return token;
}

async function removeUserToken(userId) {
  await User.findByIdAndUpdate(userId, { token: null });
}

function getUser(userId) {
  return User.findById(userId);
}

function updateUser(userId, updates) {
  return User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  });
}

const usersService = {
  addUsertoDB,
  checkUserInDB,
  addUserToken,
  removeUserToken,
  getUser,
  updateUser,
};

export default usersService;
