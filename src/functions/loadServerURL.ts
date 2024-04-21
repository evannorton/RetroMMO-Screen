import { getEnvironmentVariable } from "pixel-pigeon";
import { state } from "../state";

export const loadServerURL = (): void => {
  const serverURL: unknown = getEnvironmentVariable("SERVER_URL");
  if (typeof serverURL !== "string") {
    throw new Error("SERVER_URL environment variable must be a string");
  }
  state.setValues({ serverURL });
};
