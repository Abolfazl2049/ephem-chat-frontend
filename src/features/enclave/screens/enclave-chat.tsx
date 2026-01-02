"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchEnclaveData, fetchEnclaveDispatches } from "../service/fetch.util";
import { Dispatch, Enclave, EnclaveLog } from "../service/model";
import DispatchBox from "../components/dispatch-box";
import ChatInput from "../components/chat-input";
import EnclaveChatSkeleton from "../components/chat-skeleton";
import EnclaveLogRecord from "../components/enclave-log-record";
import { useMyUser } from "@/features/user";
import { DataTemplate } from "@/features/shared";
import { EnclaveRtcConnectionHandler } from "../service/rtc.model";
import { computedEnclaveMessages } from "../service/utils";

export default function EnclaveChatScreen() {
  const params = useParams();
  const id = params.id as string;
  const [enclave, setEnclave] = useState<Enclave | null>(null);
  const [isFetched, setIsFetched] = useState(false);
  const [dispatches, setDispatches] = useState<Dispatch[]>([]);
  const isLogin = useMyUser((state) => state.isLogin);
  const user = useMyUser((state) => state.data);
  const [rtcHandler, setRtcHandler] = useState<EnclaveRtcConnectionHandler>();

  const handleDispatchSent = async (dispatch: Dispatch) => {
    // Reload dispatches after sending
    try {
      const currentList = Array.from(dispatches);
      currentList.push(dispatch);
      setDispatches(currentList);
    } catch (err) {
      console.error("Error reloading dispatches:", err);
    }
  };

  const addLog = (log: EnclaveLog) => {
    setEnclave((prev) => {
      if (!prev) return prev;
      return new Enclave({
        ...prev,
        logs: [...prev.logs, log],
      });
    });
  };

  useEffect(() => {
    if (isLogin) {
      Promise.all([fetchEnclaveData(id), fetchEnclaveDispatches(id)])
        .then(([enclaveRes, dispatchesRes]) => {
          const newEnclave = new Enclave(enclaveRes.data);
          setEnclave(newEnclave);
          const parsedDispatches = dispatchesRes.rows.map((d) => new Dispatch(d));
          setDispatches(parsedDispatches);
          if (user && newEnclave)
            setRtcHandler(new EnclaveRtcConnectionHandler({ enclaveId: id, userId: user.id, addLog, myUserId: user.id }));
        })
        .finally(() => {
          setIsFetched(true);
        });

      // rtc
    }
  }, [isLogin]);

  return (
    <DataTemplate
      data={enclave}
      isFetched={isFetched}
      emptyTemplate={
        <div className="flex items-center justify-center bg-black">
          <div className="space-y-4 text-center">
            <p className="text-zinc-400">No enclave data found</p>
          </div>
        </div>
      }
      loadingTemplate={<EnclaveChatSkeleton />}>
      <div className="flex h-[calc(100vh-64px)] flex-col bg-black">
        {/* Header */}
        <div className="border-b border-zinc-800 bg-zinc-950/50 px-6 py-4 backdrop-blur-sm">
          <h1 className="text-lg font-semibold text-white">{"Enclave"}</h1>
          <p className="text-xs text-zinc-400">ID: {enclave?.id}</p>
        </div>

        {/* Dispatches List */}
        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
          {dispatches.length === 0 && enclave?.logs.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-zinc-500">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            computedEnclaveMessages(enclave?.logs || [], dispatches).map((message) =>
              message.type === "DISPATCH" ? (
                <DispatchBox key={message.data.id} dispatch={message.data} />
              ) : (
                <EnclaveLogRecord log={message.data} key={message.createdAt} />
              ),
            )
          )}
        </div>

        {/* Chat Input */}
        <ChatInput enclaveId={id} onDispatchSent={handleDispatchSent} />
      </div>
    </DataTemplate>
  );
}
