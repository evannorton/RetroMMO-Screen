import { makeHTTPRequest } from "pixel-pigeon";
import { state } from "../state";

export const loadGameData = async (): Promise<void> => {
  if (state.values.serverURL === null) {
    throw new Error("Attempted to load game data with no server URL.");
  }
  const gameData: Response = await makeHTTPRequest({
    url: `${state.values.serverURL}/game-data.json`,
  });
  const data: unknown = await gameData.json();
  console.log(data);
  state.setValues({ hasLoadedGameData: true });
};
