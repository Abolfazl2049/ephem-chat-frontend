"use client";

import { useEffect, useRef, useState } from "react";
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
import ChatHeader from "../components/chat-header";

export default function EnclaveChatScreen() {
  const params = useParams();
  const id = params.id as string;
  const [enclave, setEnclave] = useState<Enclave | null>(null);
  const [isFetched, setIsFetched] = useState(false);
  const [dispatches, setDispatches] = useState<Dispatch[]>([]);
  const isLogin = useMyUser((state) => state.isLogin);
  const user = useMyUser((state) => state.data);
  const rtcHandler = useRef<EnclaveRtcConnectionHandler | null>(null);
  const isInit = useRef(false);
  const onDispatchReceive = (dispatch: Dispatch) => {
    setDispatches((prev) => [...prev, dispatch]);
    scrollToBtm();
  };

  const sendDispatch = (dispatch: Dispatch) => {
    rtcHandler.current?.sendDispatch(dispatch);
    setDispatches((prev) => [...prev, dispatch]);
    scrollToBtm();
  };

  const addLog = (log: EnclaveLog) => {
    setEnclave((prev) => {
      if (!prev) return prev;
      return new Enclave({
        ...prev,
        logs: [...prev.logs, log],
      });
    });

    scrollToBtm();
  };

  const scrollToBtm = () => {
    setTimeout(() => {
      const con = document.querySelector("#enclave-messages-con");
      if (con) con.scrollTop = con.scrollHeight;
    }, 400);
  };

  useEffect(() => {
    if (isLogin && !isInit.current) {
      isInit.current = true;
      Promise.all([fetchEnclaveData(id), fetchEnclaveDispatches(id)])
        .then(([enclaveRes, dispatchesRes]) => {
          const newEnclave = new Enclave(enclaveRes.data);
          setEnclave(newEnclave);
          const parsedDispatches = dispatchesRes.rows.map((d) => new Dispatch(d));
          setDispatches(parsedDispatches);

          // rtc handler
          if (user && newEnclave) {
            rtcHandler.current = new EnclaveRtcConnectionHandler({
              enclaveId: id,
              userId: user.id,
              addLog,
              myUserId: user.id,
              onDispatchReceive,
            });
          }

          scrollToBtm();
        })
        .finally(() => {
          setIsFetched(true);
        });
    }
    return () => {
      console.log("onmount", rtcHandler.current);
      rtcHandler.current?.clear();
    };
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
        <ChatHeader enclave={enclave!} />
        {/* Dispatches List */}
        <div id="enclave-messages-con" className="flex-1 space-y-4 overflow-y-auto scroll-smooth px-6 py-4">
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
        <ChatInput enclaveId={id} sendDispatch={sendDispatch} />
      </div>
    </DataTemplate>
  );
}
