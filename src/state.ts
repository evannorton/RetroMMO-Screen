import { State } from "pixel-pigeon";

interface StateSchema {
  hasLoadedGameData: boolean;
  serverURL: string | null;
}

export const state: State<StateSchema> = new State<StateSchema>({
  hasLoadedGameData: false,
  serverURL: null,
});
