import { BattleExitToWorldUpdate } from "retrommo-types";
import { Character } from "../../classes/Character";
import { createWorldState } from "../state/createWorldState";
import { getDefinable } from "../../definables";
import { listenToSocketioEvent } from "pixel-pigeon";
import { loadWorldCharacterUpdate } from "../loadWorldCharacterUpdate";
import { selectCharacter } from "../selectCharacter";
import { state } from "../../state";
import { updateCharacterPosition } from "../updateCharacterPosition";

export const listenForBattleUpdates = (): void => {
  listenToSocketioEvent<BattleExitToWorldUpdate>({
    event: "battle/exit-to-world",
    onMessage: (update: BattleExitToWorldUpdate): void => {
      state.setValues({
        battleState: null,
        worldState: createWorldState(update.characterID),
      });
      const character: Character = getDefinable(Character, update.characterID);
      character.tilemapID = update.tilemapID;
      updateCharacterPosition(character.id, update.x, update.y);
      selectCharacter(update.characterID);
      for (const characterUpdate of update.characters) {
        loadWorldCharacterUpdate(characterUpdate);
      }
    },
  });
};
