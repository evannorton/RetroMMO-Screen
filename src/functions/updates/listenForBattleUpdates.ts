import { BattleExitToWorldUpdate } from "retrommo-types";
import { WorldCharacter } from "../../classes/WorldCharacter";
import { createWorldState } from "../state/createWorldState";
import { getDefinable } from "../../definables";
import { listenToSocketioEvent } from "pixel-pigeon";
import { loadWorldCharacterUpdate } from "../loadWorldCharacterUpdate";
import { loadWorldPartyUpdate } from "../loadWorldPartyUpdate";
import { selectWorldCharacter } from "../selectWorldCharacter";
import { state } from "../../state";
import { updateWorldCharacterPosition } from "../updateWorldCharacterPosition";

export const listenForBattleUpdates = (): void => {
  listenToSocketioEvent<BattleExitToWorldUpdate>({
    event: "battle/exit-to-world",
    onMessage: (update: BattleExitToWorldUpdate): void => {
      state.setValues({
        battleState: null,
        worldState: createWorldState(update.worldCharacterID),
      });
      const worldCharacter: WorldCharacter = getDefinable(
        WorldCharacter,
        update.worldCharacterID,
      );
      worldCharacter.tilemapID = update.tilemapID;
      updateWorldCharacterPosition(worldCharacter.id, update.x, update.y);
      for (const characterUpdate of update.worldCharacters) {
        loadWorldCharacterUpdate(characterUpdate);
      }
      for (const partyUpdate of update.parties) {
        loadWorldPartyUpdate(partyUpdate);
      }
      selectWorldCharacter(update.worldCharacterID);
    },
  });
};
