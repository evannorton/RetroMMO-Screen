import { BattleExitToWorldUpdate } from "retrommo-types";
import { Character } from "../../classes/Character";
import { createWorldState } from "../state/createWorldState";
import { getDefinable } from "../../definables";
import { listenToSocketioEvent } from "pixel-pigeon";
import { loadWorldCharacterUpdate } from "../loadWorldCharacterUpdate";
import { state } from "../../state";

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
      character.x = update.x;
      character.y = update.y;
      character.selectCharacter();
      for (const characterUpdate of update.characters) {
        loadWorldCharacterUpdate(characterUpdate);
      }
    },
  });
};
