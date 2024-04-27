import { State } from "pixel-pigeon";
import { WorldStateSchema } from "../../state";

export const createWorldState = (): State<WorldStateSchema> =>
  new State<WorldStateSchema>({});
