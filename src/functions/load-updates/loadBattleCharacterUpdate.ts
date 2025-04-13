import { BattleCharacter } from "../../classes/BattleCharacter";
import { BattleCharacterUpdate } from "retrommo-types";

export const loadBattleCharacterUpdate = (
  battleCharacterUpdate: BattleCharacterUpdate,
): void => {
  new BattleCharacter(battleCharacterUpdate.characterID, {
    clothesDyeItemID: battleCharacterUpdate.clothesDyeItemID,
    figureID: battleCharacterUpdate.figureID,
    hairDyeItemID: battleCharacterUpdate.hairDyeItemID,
    maskItemID: battleCharacterUpdate.maskItemID,
    outfitItemID: battleCharacterUpdate.outfitItemID,
    playerID: battleCharacterUpdate.playerID,
    resources: battleCharacterUpdate.resources,
    skinColorID: battleCharacterUpdate.skinColorID,
  });
};
