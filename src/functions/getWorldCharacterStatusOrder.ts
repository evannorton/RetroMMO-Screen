import { WorldCharacter } from "../classes/WorldCharacter";
import { getDefinable } from "definables";

export const getWorldCharacterPoisonOrder = (
  worldCharacterID: string,
): number | null => {
  const worldCharacter: WorldCharacter = getDefinable(
    WorldCharacter,
    worldCharacterID,
  );
  let poisonOrder: number | null = null;
  if (worldCharacter.isPoisoned) {
    poisonOrder = worldCharacter.poisonOrder ?? 0;
  }
  return poisonOrder;
};
export const getWorldCharacterRenewOrder = (
  worldCharacterID: string,
): number | null => {
  const worldCharacter: WorldCharacter = getDefinable(
    WorldCharacter,
    worldCharacterID,
  );
  let renewOrder: number | null = null;
  if (worldCharacter.isRenewing) {
    renewOrder =
      worldCharacter.renewOrder ?? (worldCharacter.isPoisoned ? 1 : 0);
  }
  return renewOrder;
};
export const getNextWorldCharacterStatusOrder = (
  worldCharacterID: string,
): number => {
  const poisonOrder: number =
    getWorldCharacterPoisonOrder(worldCharacterID) ?? -1;
  const renewOrder: number =
    getWorldCharacterRenewOrder(worldCharacterID) ?? -1;
  return Math.max(poisonOrder, renewOrder) + 1;
};
