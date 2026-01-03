import moment from "moment";
import { Dispatch, EnclaveLog } from "./model";

enum EnclaveMessageType {
  LOG,
  DISPATCH,
}
interface BaseEnclaveMessage {
  type: keyof typeof EnclaveMessageType;
  data: Dispatch | EnclaveLog;
  createdAt: string;
}

interface EnclaveDispatchMType extends BaseEnclaveMessage {
  type: "DISPATCH";
  data: Dispatch;
}
interface EnclaveLogMType extends BaseEnclaveMessage {
  type: "LOG";
  data: EnclaveLog;
}

type EnclaveMessage = EnclaveDispatchMType | EnclaveLogMType;

const computedEnclaveMessages: (logs: EnclaveLog[], dispatches: Dispatch[]) => EnclaveMessage[] = (logs, dispatches) => {
  const messages: EnclaveMessage[] = [];
  for (const log of logs) messages.push({ createdAt: log.createdAt, type: "LOG", data: log });
  for (const dispatch of dispatches) messages.push({ createdAt: dispatch.createdAt, type: "DISPATCH", data: dispatch });
  messages.sort((a, b) => moment(moment(b.createdAt)).diff(a.createdAt));
  return messages;
};

export { computedEnclaveMessages };
