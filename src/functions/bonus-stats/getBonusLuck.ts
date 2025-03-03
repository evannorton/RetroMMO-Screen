import { Boost } from "../../classes/Boost";
import { ItemInstance } from "../../classes/ItemInstance";
import { Stat } from "retrommo-types";
import { State } from "pixel-pigeon";
import { WorldStateSchema } from "../../state";
import { getDefinable } from "definables";
import { getWorldState } from "../state/getWorldState";

export const getBonusLuck = (): number => {
  const worldState: State<WorldStateSchema> = getWorldState();
  let luck: number = 0;
  if (worldState.values.bodyItemInstanceID !== null) {
    const bodyItemInstance: ItemInstance = getDefinable(
      ItemInstance,
      worldState.values.bodyItemInstanceID,
    );
    luck += bodyItemInstance.item.equipmentPiece.luck;
  }
  if (worldState.values.headItemInstanceID !== null) {
    const headItemInstance: ItemInstance = getDefinable(
      ItemInstance,
      worldState.values.headItemInstanceID,
    );
    luck += headItemInstance.item.equipmentPiece.luck;
  }
  if (worldState.values.mainHandItemInstanceID !== null) {
    const mainHandItemInstance: ItemInstance = getDefinable(
      ItemInstance,
      worldState.values.mainHandItemInstanceID,
    );
    luck += mainHandItemInstance.item.equipmentPiece.luck;
  }
  if (worldState.values.offHandItemInstanceID !== null) {
    const offHandItemInstance: ItemInstance = getDefinable(
      ItemInstance,
      worldState.values.offHandItemInstanceID,
    );
    luck += offHandItemInstance.item.equipmentPiece.luck;
  }
  for (const boostItemInstanceID of worldState.values.boostItemInstanceIDs) {
    const itemInstance: ItemInstance = getDefinable(
      ItemInstance,
      boostItemInstanceID,
    );
    const boost: Boost = itemInstance.item.ability.boost;
    if (boost.stat === Stat.Luck) {
      luck += boost.amount;
    }
  }
  return luck;
};
