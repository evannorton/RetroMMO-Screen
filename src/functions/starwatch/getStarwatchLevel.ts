import { Battler } from "../../classes/Battler";
import { WorldCharacter } from "../../classes/WorldCharacter";
import { getDefinable } from "definables";
import { state } from "../../state";

export const getStarwatchLevel = (): string => {
  if (state.values.worldState !== null) {
    const worldCharacter: WorldCharacter = getDefinable(
      WorldCharacter,
      state.values.worldState.values.worldCharacterID,
    );
    return worldCharacter.tilemapID;
  }
  if (state.values.battleState !== null) {
    const battler: Battler = getDefinable(
      Battler,
      state.values.battleState.values.battlerID,
    );
    return battler.battleCharacter.tilemapID;
  }
  return "main-menu";
};
