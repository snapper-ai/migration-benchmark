import { getCurrentUserId } from "../utils/currentUser.js";
import { useAppState } from "../state/AppState.jsx";

export function useCurrentUser() {
  const users = useAppState().users.items;
  const id = getCurrentUserId();
  const user = users.find((u) => u.id === id) || null;
  return user;
}


