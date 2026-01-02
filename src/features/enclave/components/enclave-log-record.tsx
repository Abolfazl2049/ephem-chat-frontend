import { EnclaveLog } from "../service/model";

export default function EnclaveLogRecord({ log }: { log: EnclaveLog }) {
  return (
    <div className="flex justify-center">
      <div className="max-w-md rounded-lg bg-zinc-800/50 px-3 py-2 text-center text-xs text-zinc-400">{log.description}</div>
    </div>
  );
}
