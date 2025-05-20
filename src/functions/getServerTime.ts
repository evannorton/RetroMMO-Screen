import { state } from "../state";

export const getServerTime = (): number => {
  if (state.values.serverTime !== null) {
    return state.values.serverTime;
  }
  throw new Error("Server time is not set.");
};
