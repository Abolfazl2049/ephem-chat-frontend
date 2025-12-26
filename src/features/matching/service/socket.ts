import { API_BASE_URL } from "@/features/shared";
import { io } from "socket.io-client";

type MatchingSocketListener = {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onMatchFound?: () => void;
  onEnclaveCreated?: (enclaveId: string) => void;
};

const startMatchingSocket = (userId: string, listeners: MatchingSocketListener = {}) => {
  const connection = io(`${API_BASE_URL}/matching`, {
    auth: {
      userId: userId || "",
    },
  });
  connection.on("connect", () => {
    listeners.onConnect?.();
  });
  connection.on("disconnect", () => {
    listeners.onDisconnect?.();
  });
  connection.on("matchFound", () => {
    listeners.onMatchFound?.();
  });
  connection.on("enclaveCreated", (data) => {
    console.log("Enclave created with data:", data);
    listeners.onEnclaveCreated?.(data.enclaveId);
  });
  return connection;
};
export { startMatchingSocket };
