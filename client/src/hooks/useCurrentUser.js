import { useSelector } from "react-redux";
import { getCurrentUserId } from "../utils/currentUser.js";

export function useCurrentUser() {
  const users = useSelector((s) => s.users.items);
  const id = getCurrentUserId();
  const user = users.find((u) => u.id === id) || null;
  return user;
}


