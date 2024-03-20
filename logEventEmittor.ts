import fs from "fs";
import events from "events";
import { type Method } from "./server";
import { type AddressInfo } from "net";

export interface ILogEvent {
  time: Date;
  route: string;
  method: Method;
  issuer: AddressInfo;
  payload?: string;
}

const LOGS_FILENAME = "logs.txt";
export const REQUEST_EVENT = "request";
const writeStream = fs.createWriteStream(LOGS_FILENAME, { flags: "a" });
const logEventEmitter = new events.EventEmitter();

logEventEmitter.on(REQUEST_EVENT, (event: ILogEvent) => {
  writeStream.write(`Accepted request at: ${event.time.toISOString()}`);
  writeStream.write(` - method: ${event.method}`);
  writeStream.write(` - route: ${event.route}`);
  writeStream.write(`- issuer: ${JSON.stringify(event.issuer)}`);
  if (event.payload !== undefined) {
    writeStream.write(` - payload: ${event.payload}`);
  }
  writeStream.write("\n");
});

export default logEventEmitter;
