import { PaginatedResponse, SuccessResponse } from "@/features/shared/types/fetch";
import { $$fetch } from "@/libs/ofetch";

const fetchEnclaveData = (id: string) => {
  return $$fetch<SuccessResponse>(`/enclave/${id}`);
};
const fetchMyEnclaves = async () => {
  return $$fetch<PaginatedResponse>("/enclave/me");
};

const fetchEnclaveDispatches = (id: string, query?: Record<string, string>) => {
  return $$fetch<PaginatedResponse>(`/enclave/dispatch/${id}`, { query });
};

const fetchSendDispatch = (content: string, enclaveId: string) => {
  return $$fetch<SuccessResponse>("/enclave/dispatch", {
    method: "POST",
    body: {
      content,
      enclaveId,
    },
  });
};

export { fetchEnclaveData, fetchMyEnclaves, fetchEnclaveDispatches, fetchSendDispatch };
