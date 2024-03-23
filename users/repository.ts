import { Role, IUser } from "./model";
import IRepository from "../repository";
import mongoose from "mongoose";

const UserMongoSchema = new mongoose.Schema({
  username: String,
  password: {
    hash: String,
    salt: String,
  },
  role: { type: "string", enum: Object.keys(Role) },
});

const User = mongoose.model("user", UserMongoSchema);

async function getAll(): Promise<IUser[]> {
  const users = await User.find();
  return users.map((user) => user.toObject());
}

async function get(id: string): Promise<IUser> {
  const user = await User.findById(id);

  if (!user) {
    throw new Error("User not found");
  }

  return user?.toObject();
}

async function add(attributes: IUser): Promise<IUser> {
  const user = await new User(attributes).save();
  return user.toObject();
}

async function put(id: string, attributes: IUser): Promise<IUser> {
  const newUser = await User.findByIdAndUpdate(id, attributes);

  if (!newUser) {
    throw new Error("User not found");
  }

  return newUser?.toObject();
}

async function deleteOne(id: string): Promise<void> {
  const result = await User.findByIdAndDelete(id);

  if (!result) {
    throw new Error("User not found");
  }
}

const repository: IRepository<IUser> = {
  add,
  get,
  put,
  deleteOne,
  getAll,
};

export default repository;
