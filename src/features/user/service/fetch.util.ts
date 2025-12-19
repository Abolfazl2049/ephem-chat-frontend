import { $$fetch } from "@/libs/ofetch";

const fetchMyUserData = () => {
  return $$fetch("/user/me");
};
export { fetchMyUserData };
