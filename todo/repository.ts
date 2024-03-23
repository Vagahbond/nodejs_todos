import mongoose, { ObjectId, Schema } from "mongoose";

import { ITodo } from "./model";
import IRepository from "../repository";

const ObjectId = mongoose.Schema.Types.ObjectId;

const TodoMongoSchema = new mongoose.Schema(
  {
    description: String,
    done: { type: "boolean", default: false },
    name: String,
    creator: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    methods: {
      setDone() {
        return this.set("done", true).save();
      },
    },
    statics: {
      async forUser(user: ObjectId): Promise<ITodo[]> {
        return await this.find({ creator: user });
      },
    },
  },
);

const Todo = mongoose.model("todo", TodoMongoSchema);

async function getAll(): Promise<ITodo[]> {
  const todos = await Todo.find();
  return todos.map((todo) => todo.toObject());
}

async function get(id: string): Promise<ITodo> {
  const todo = await Todo.findById(id);

  if (!todo) {
    throw new Error("Todo not found");
  }

  return todo?.toObject();
}

async function add(attributes: ITodo): Promise<ITodo> {
  const todo = await new Todo(attributes).save();
  return todo.toObject();
}

async function put(id: string, attributes: ITodo): Promise<ITodo> {
  const newTodo = await Todo.findByIdAndUpdate(id, attributes);

  if (!newTodo) {
    throw new Error("Todo not found");
  }

  return newTodo?.toObject();
}

async function deleteOne(id: string): Promise<void> {
  const result = await Todo.findByIdAndDelete(id);

  if (!result) {
    throw new Error("Todo not found");
  }
}

async function getForUser(userId: string): Promise<ITodo[]> {
  const id = new ObjectId(userId);
  return await Todo.forUser(id);
}

interface ITodoRepository extends IRepository<ITodo> {
  getForUser: (userId: string) => Promise<ITodo[]>;
}

const repository: ITodoRepository = {
  getForUser,
  add,
  get,
  put,
  deleteOne,
  getAll,
};

export default repository;
