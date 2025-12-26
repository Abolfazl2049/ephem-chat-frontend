import { Dispatch } from "../service/model";

interface DispatchBoxProps {
  dispatch: Dispatch;
}

export default function DispatchBox({ dispatch }: DispatchBoxProps) {
  return (
    <div className="flex items-start gap-4">
      {/* Avatar */}
      <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600">
        <span className="text-xs font-bold text-white">{dispatch.senderName?.charAt(0).toUpperCase() || "?"}</span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1">
        <p className="text-sm font-semibold text-zinc-300">{dispatch.senderName || "Unknown"}</p>
        <div className="w-fit rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2">
          <p className="text-sm break-words text-zinc-100">{dispatch.content}</p>
        </div>
      </div>
    </div>
  );
}
