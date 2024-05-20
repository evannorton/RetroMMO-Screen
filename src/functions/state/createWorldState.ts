import { State } from "pixel-pigeon";
import { WorldStateSchema } from "../../state";

export const createWorldState = (
  characterID: string,
): State<WorldStateSchema> =>
  new State<WorldStateSchema>({
    characterID,
  });
