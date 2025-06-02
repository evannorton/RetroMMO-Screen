import { BattleCharacter } from "../../classes/BattleCharacter";
import { BattleCharacterUpdate } from "retrommo-types";

export const loadBattleCharacterUpdate = (
  battleCharacterUpdate: BattleCharacterUpdate,
): void => {
  new BattleCharacter(battleCharacterUpdate.characterID, {
    battlerID: battleCharacterUpdate.battlerID,
    classID: battleCharacterUpdate.classID,
    clothesDyeItemID: battleCharacterUpdate.clothesDyeItemID,
    figureID: battleCharacterUpdate.figureID,
    hairDyeItemID: battleCharacterUpdate.hairDyeItemID,
    maskItemID: battleCharacterUpdate.maskItemID,
    outfitItemID: battleCharacterUpdate.outfitItemID,
    playerID: battleCharacterUpdate.playerID,
    skinColorID: battleCharacterUpdate.skinColorID,
  });
};
