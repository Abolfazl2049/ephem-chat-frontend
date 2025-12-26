import { $$fetch } from "@/libs/ofetch";

const fetchEnclaveData = (id: string) => {
  return $$fetch(`/enclave/${id}`);
};
const fetchMyEnclaves = async () => {
  return $$fetch("/enclave/me");
};
export { fetchEnclaveData, fetchMyEnclaves };
