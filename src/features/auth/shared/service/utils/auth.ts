import { cookies } from "next/headers";
let USER_TOKEN = "";
const getToken = async () => {
  const res = await cookies();
  USER_TOKEN = res.get("token")?.value || "";
  return res.get("token");
};
export { getToken, USER_TOKEN };
