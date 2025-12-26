"use client";
import { getUserToken } from "@/features/auth/service/utils";
import { API_BASE_URL } from "@/features/auth/shared/service/constants";
import { $fetch } from "ofetch";

const parseApiResMessage = (data: any) => {
  const objectFirstKey = typeof data === "object" ? Object.keys(data)[0] : null;
  if (Array.isArray(data)) return data.join("-");
  else if (data.message) return data.message;
  else if (objectFirstKey) return `${data[objectFirstKey]}`;
  else if (typeof data === "string" && data.length < 64) return data;
  else return "Error try again";
};

const onResponseError = (err: any) => {
  const { _data: resData, status } = err.response;

  if (Object.values(resData)[0] === "FetchError" && !status) addErrToast();
  const apiMessage = parseApiResMessage(resData);

  switch (status) {
    case 500:
    case 502:
      addErrToast();
      break;
    default:
      addErrToast(apiMessage);
  }
};
const addErrToast = (message: string | null = null) => {};

const onRequestError = () => {
  addErrToast();
};
const getHeaders = (options: { withToken?: boolean } = { withToken: true }): HeadersInit => {
  const token = getUserToken();
  if (token)
    return {
      Authorization: token,
    };
  else return {};
};

const headers = getHeaders();
let $$fetch: typeof $fetch = $fetch.create({
  baseURL: API_BASE_URL,
  onResponseError,
  onRequestError,
  retry: 0,
  timeout: 30000,
  retryStatusCodes: [],
  headers,
});

function reInitFetch() {
  const headers = getHeaders();
  $$fetch = $fetch.create({
    headers,
    baseURL: API_BASE_URL,
    retry: 0,
    onResponseError,
    onRequestError,
    timeout: 30000,
    retryStatusCodes: [],
  });
}
export { $$fetch, reInitFetch, getHeaders };
