import { State } from "pixel-pigeon";

interface StateSchema {
  serverURL: string | null;
}

export const state: State<StateSchema> = new State<StateSchema>({
  serverURL: null,
});
