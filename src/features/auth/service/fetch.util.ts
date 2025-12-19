import { $fetch } from "ofetch";
import { API_BASE_URL } from "../shared/service/constants";

export interface Session {
  id: string;
  expiresAt: string;
  user: string;
  token: string;
  updatedAt: string;
  createdAt: string;
}

export interface SessionResponse {
  message: string;
  data: {
    session: Session;
  };
}

export const createSession = async (name: string): Promise<SessionResponse> => {
  const data = await $fetch<SessionResponse>(`${API_BASE_URL}/session/create`, {
    method: "POST",
    body: { name },
  });

  return data;
};
