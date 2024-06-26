import User from "./schemas/usersSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import { nanoid } from "nanoid";

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
    avatarURL: gravatar.url(data.email),
    verificationToken: nanoid(),
  };

  return User.create(newUser);
}

async function checkUserLoginData(data) {
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

function findUser(data) {
  return User.findOne(data);
}

function updateUser(userId, updates) {
  return User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  });
}

const usersService = {
  addUsertoDB,
  checkUserLoginData,
  addUserToken,
  removeUserToken,
  findUser,
  updateUser,
};

export default usersService;
