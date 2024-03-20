import { type IncomingMessage, type ServerResponse } from "http";
import { toDoSchema, updateToDoSchema } from "./todoModel";
import repository from "./todoRepository";

function throw404(res: ServerResponse) {
  res
    .writeHead(404, { "Content-Type": "application/json" })
    .end(JSON.stringify({ message: "Not found" }));
}

export default (
  req: IncomingMessage,
  res: ServerResponse,
  payload: string | Buffer,
): void => {
  const pathEnd = req?.url?.split("/")[2];
  let id: number | null = null;

  if (pathEnd) {
    try {
      id = Number.parseInt(pathEnd);
    } catch {
      throw404(res);
      return;
    }
  }

  switch (req.method) {
    case "GET":
      if (id) {
        const todo = repository.get(id);

        if (!todo) {
          res
            .writeHead(404, { "Content-Type": "application/json" })
            .end(JSON.stringify({ message: "Todo not found" }));
          break;
        }

        res
          .writeHead(200, { "Content-Type": "application/json" })
          .end(JSON.stringify(todo));
        break;
      }

      res
        .writeHead(200, { "Content-Type": "application/json" })
        .end(JSON.stringify(repository.getAll()));
      break;

    case "POST":
      const todo = JSON.parse(payload.toString());
      const { value, error } = toDoSchema.validate(todo);

      if (!error) {
        res
          .writeHead(201, { "Content-Type": "application/json" })
          .end(JSON.stringify(repository.add(value)));
        break;
      }

      res
        .writeHead(400, { "Content-Type": "application/json" })
        .end(JSON.stringify({ message: error?.message }));

      break;

    case "DELETE":
      if (id && repository.get(id)) {
        res
          .writeHead(204, { "Content-Type": "application/json" })
          .end(JSON.stringify(repository.delete(id)));

        break;
      }

      throw404(res);

      break;

    case "PATCH":
      if (!id || !repository.get(id)) {
        throw404(res);
        break;
      }

      const partialTodo = JSON.parse(payload.toString());
      const validationResult = updateToDoSchema.validate(partialTodo);

      if (!validationResult.error) {
        res
          .writeHead(200, { "Content-Type": "application/json" })
          .end(JSON.stringify(repository.put(id, validationResult.value)));
        break;
      }

      res
        .writeHead(400, { "Content-Type": "application/json" })
        .end(JSON.stringify({ message: validationResult.error?.message }));

      break;

    default:
      throw404(res);
  }
};
