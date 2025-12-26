"use client";
const getUserToken = () => {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  return token;
};

const clearUserToken = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
};
export { getUserToken, clearUserToken };
