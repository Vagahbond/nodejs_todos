import { type IToDo } from "./model";
import IRepository from "../repository";

export class TodoRepository implements IRepository<IToDo> {
  todos: IToDo[];

  constructor() {
    this.todos = [];
  }

  getAll(): IToDo[] {
    return this.todos.map((todo, index) => {
      return {
        ...todo,
        id: index + 1,
      };
    });
  }

  get(id: number): IToDo {
    return this.todos[id - 1];
  }

  put(id: number, item: any): void {
    this.todos[id - 1] = {
      ...this.todos[id - 1],
      ...item,
    };
  }

  add(item: IToDo): void {
    this.todos.push(item);
  }

  delete(id: number): boolean {
    if (this.todos[id - 1] === undefined) {
      return false;
    }
    this.todos.splice(id - 1, 1);

    return true;
  }
}

export default new TodoRepository();
