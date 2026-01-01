"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { fetchEnclaveData, fetchEnclaveDispatches } from "../service/fetch.util";
import { Dispatch, Enclave } from "../service/model";
import DispatchBox from "../components/dispatch-box";
import ChatInput from "../components/chat-input";
import EnclaveChatSkeleton from "../components/chat-skeleton";
import MyEnclavesSidebar from "../components/my-enclaves-sidebar";

export default function EnclaveChatScreen() {
  const params = useParams();
  const id = params.id as string;
  const [enclave, setEnclave] = useState<Enclave | null>(null);
  const [isFetched, setIsFetched] = useState(false);
  const hasInitiated = useRef(false);
  const [dispatches, setDispatches] = useState<Dispatch[]>([]);

  const loadEnclaveData = async () => {};

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
  useEffect(() => {
    console.log("effect");
    if (!hasInitiated.current && id) {
      hasInitiated.current = true;
      Promise.all([fetchEnclaveData(id), fetchEnclaveDispatches(id)])
        .then(([enclaveRes, dispatchesRes]) => {
          setEnclave(new Enclave(enclaveRes.data));
          const parsedDispatches = dispatchesRes.rows.map((d) => new Dispatch(d));
          setDispatches(parsedDispatches);
        })
        .finally(() => {
          setIsFetched(true);
        });
    }
  }, []);

  return <MyEnclavesSidebar />;
  if (!isFetched) {
    return <EnclaveChatSkeleton />;
  }

  // if (error) {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center bg-black">
  //       <div className="space-y-4 text-center">
  //         <p className="text-red-400">{error}</p>
  //       </div>
  //     </div>
  //   );
  // }

  if (!enclave) {
    return (
      <div className="flex items-center justify-center bg-black">
        <div className="space-y-4 text-center">
          <p className="text-zinc-400">No enclave data found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col bg-black">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-950/50 px-6 py-4 backdrop-blur-sm">
        <h1 className="text-lg font-semibold text-white">{"Enclave"}</h1>
        <p className="text-xs text-zinc-400">ID: {enclave.id}</p>
      </div>

      {/* Dispatches List */}
      <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
        {dispatches.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-zinc-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          dispatches.map((dispatch) => <DispatchBox key={dispatch.id} dispatch={dispatch} />)
        )}
      </div>

      {/* Chat Input */}
      <ChatInput enclaveId={id} onDispatchSent={handleDispatchSent} />
    </div>
  );
}
