import { WorldCharacter } from "../classes/WorldCharacter";
import { WorldClickCharacterUpdate } from "retrommo-types";
import { emitToSocketioServer } from "pixel-pigeon";
import { getDefinable } from "definables/lib/getDefinable";

export const handleWorldCharacterClick = (worldCharacterID: string): void => {
  const worldCharacter: WorldCharacter = getDefinable(
    WorldCharacter,
    worldCharacterID,
  );
  emitToSocketioServer<WorldClickCharacterUpdate>({
    data: {
      playerID: worldCharacter.playerID,
    },
    event: "world/click-character",
  });
};
