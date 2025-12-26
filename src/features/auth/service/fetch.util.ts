import { $fetch } from "ofetch";
import { API_BASE_URL } from "../../shared/service/constants";
import { $$fetch } from "@/libs/ofetch";
interface Session {
  id: string;
  expiresAt: string;
  user: string;
  token: string;
  updatedAt: string;
  createdAt: string;
}
interface CreateSessionRes {
  message: string;
  data: {
    session: Session;
  };
}

const fetchCreateSession = async (name: string): Promise<CreateSessionRes> => {
  return await $fetch<CreateSessionRes>(`${API_BASE_URL}/session/create`, {
    method: "POST",
    body: { name },
  });
};
const fetchUserProfile = () => {
  return $$fetch("/user/me", {});
};
export type { Session, CreateSessionRes };
export { fetchCreateSession, fetchUserProfile };
