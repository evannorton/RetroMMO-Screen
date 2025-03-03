import { Boost } from "../../classes/Boost";
import { ItemInstance } from "../../classes/ItemInstance";
import { Stat } from "retrommo-types";
import { State } from "pixel-pigeon";
import { WorldStateSchema } from "../../state";
import { getDefinable } from "definables";
import { getWorldState } from "../state/getWorldState";

export const getBonusDefense = (): number => {
  const worldState: State<WorldStateSchema> = getWorldState();
  let defense: number = 0;
  if (worldState.values.bodyItemInstanceID !== null) {
    const bodyItemInstance: ItemInstance = getDefinable(
      ItemInstance,
      worldState.values.bodyItemInstanceID,
    );
    defense += bodyItemInstance.item.equipmentPiece.defense;
  }
  if (worldState.values.headItemInstanceID !== null) {
    const headItemInstance: ItemInstance = getDefinable(
      ItemInstance,
      worldState.values.headItemInstanceID,
    );
    defense += headItemInstance.item.equipmentPiece.defense;
  }
  if (worldState.values.mainHandItemInstanceID !== null) {
    const mainHandItemInstance: ItemInstance = getDefinable(
      ItemInstance,
      worldState.values.mainHandItemInstanceID,
    );
    defense += mainHandItemInstance.item.equipmentPiece.defense;
  }
  if (worldState.values.offHandItemInstanceID !== null) {
    const offHandItemInstance: ItemInstance = getDefinable(
      ItemInstance,
      worldState.values.offHandItemInstanceID,
    );
    defense += offHandItemInstance.item.equipmentPiece.defense;
  }
  for (const boostItemInstanceID of worldState.values.boostItemInstanceIDs) {
    const itemInstance: ItemInstance = getDefinable(
      ItemInstance,
      boostItemInstanceID,
    );
    const boost: Boost = itemInstance.item.ability.boost;
    if (boost.stat === Stat.Defense) {
      defense += boost.amount;
    }
  }
  return defense;
};
