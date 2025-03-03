import { Boost } from "../../classes/Boost";
import { ItemInstance } from "../../classes/ItemInstance";
import { Stat } from "retrommo-types";
import { State } from "pixel-pigeon";
import { WorldStateSchema } from "../../state";
import { getDefinable } from "definables";
import { getWorldState } from "../state/getWorldState";

export const getBonusWisdom = (): number => {
  const worldState: State<WorldStateSchema> = getWorldState();
  let wisdom: number = 0;
  if (worldState.values.bodyItemInstanceID !== null) {
    const bodyItemInstance: ItemInstance = getDefinable(
      ItemInstance,
      worldState.values.bodyItemInstanceID,
    );
    wisdom += bodyItemInstance.item.equipmentPiece.wisdom;
  }
  if (worldState.values.headItemInstanceID !== null) {
    const headItemInstance: ItemInstance = getDefinable(
      ItemInstance,
      worldState.values.headItemInstanceID,
    );
    wisdom += headItemInstance.item.equipmentPiece.wisdom;
  }
  if (worldState.values.mainHandItemInstanceID !== null) {
    const mainHandItemInstance: ItemInstance = getDefinable(
      ItemInstance,
      worldState.values.mainHandItemInstanceID,
    );
    wisdom += mainHandItemInstance.item.equipmentPiece.wisdom;
  }
  if (worldState.values.offHandItemInstanceID !== null) {
    const offHandItemInstance: ItemInstance = getDefinable(
      ItemInstance,
      worldState.values.offHandItemInstanceID,
    );
    wisdom += offHandItemInstance.item.equipmentPiece.wisdom;
  }
  for (const boostItemInstanceID of worldState.values.boostItemInstanceIDs) {
    const itemInstance: ItemInstance = getDefinable(
      ItemInstance,
      boostItemInstanceID,
    );
    const boost: Boost = itemInstance.item.ability.boost;
    if (boost.stat === Stat.Wisdom) {
      wisdom += boost.amount;
    }
  }
  return wisdom;
};
