import { PaginatedResponse, SuccessResponse } from "@/features/shared/types/fetch";
import { $$fetch } from "@/libs/ofetch";

const fetchEnclaveData = (id: string) => {
  return $$fetch<SuccessResponse>(`/enclave/${id}`);
};
const fetchMyEnclaves = async () => {
  return $$fetch<PaginatedResponse>("/enclave/me");
};

const fetchEnclaveDispatches = (id: string) => {
  return $$fetch<PaginatedResponse>(`/enclave/dispatch/${id}`);
};

const fetchCreateDispatch = (content: string, enclaveId: string) => {
  return $$fetch<SuccessResponse>("/enclave/dispatch", {
    method: "POST",
    body: {
      content,
      enclaveId,
    },
  });
};

export { fetchEnclaveData, fetchMyEnclaves, fetchEnclaveDispatches, fetchCreateDispatch };
