import { Boost } from "../../classes/Boost";
import { ItemInstance } from "../../classes/ItemInstance";
import { Stat } from "retrommo-types";
import { State } from "pixel-pigeon";
import { WorldStateSchema } from "../../state";
import { getDefinable } from "definables";
import { getWorldState } from "../state/getWorldState";

export const getBonusAgility = (): number => {
  const worldState: State<WorldStateSchema> = getWorldState();
  let agility: number = 0;
  if (worldState.values.bodyItemInstanceID !== null) {
    const bodyItemInstance: ItemInstance = getDefinable(
      ItemInstance,
      worldState.values.bodyItemInstanceID,
    );
    agility += bodyItemInstance.item.equipmentPiece.agility;
  }
  if (worldState.values.headItemInstanceID !== null) {
    const headItemInstance: ItemInstance = getDefinable(
      ItemInstance,
      worldState.values.headItemInstanceID,
    );
    agility += headItemInstance.item.equipmentPiece.agility;
  }
  if (worldState.values.mainHandItemInstanceID !== null) {
    const mainHandItemInstance: ItemInstance = getDefinable(
      ItemInstance,
      worldState.values.mainHandItemInstanceID,
    );
    agility += mainHandItemInstance.item.equipmentPiece.agility;
  }
  if (worldState.values.offHandItemInstanceID !== null) {
    const offHandItemInstance: ItemInstance = getDefinable(
      ItemInstance,
      worldState.values.offHandItemInstanceID,
    );
    agility += offHandItemInstance.item.equipmentPiece.agility;
  }
  for (const boostItemInstanceID of worldState.values.boostItemInstanceIDs) {
    const itemInstance: ItemInstance = getDefinable(
      ItemInstance,
      boostItemInstanceID,
    );
    const boost: Boost = itemInstance.item.ability.boost;
    if (boost.stat === Stat.Agility) {
      agility += boost.amount;
    }
  }
  return agility;
};
