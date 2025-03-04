import { Boost } from "../../classes/Boost";
import { ItemInstance } from "../../classes/ItemInstance";
import { Stat } from "retrommo-types";
import { State } from "pixel-pigeon";
import { WorldStateSchema } from "../../state";
import { getDefinable } from "definables";
import { getWorldState } from "../state/getWorldState";

export const getStatBonusAmount = (stat: Stat): number => {
  const worldState: State<WorldStateSchema> = getWorldState();
  let amount: number = 0;
  if (worldState.values.bodyItemInstanceID !== null) {
    const bodyItemInstance: ItemInstance = getDefinable(
      ItemInstance,
      worldState.values.bodyItemInstanceID,
    );
    switch (stat) {
      case Stat.Agility:
        amount += bodyItemInstance.item.equipmentPiece.agility;
        break;
      case Stat.Defense:
        amount += bodyItemInstance.item.equipmentPiece.defense;
        break;
      case Stat.Intelligence:
        amount += bodyItemInstance.item.equipmentPiece.intelligence;
        break;
      case Stat.Luck:
        amount += bodyItemInstance.item.equipmentPiece.luck;
        break;
      case Stat.Strength:
        amount += bodyItemInstance.item.equipmentPiece.strength;
        break;
      case Stat.Wisdom:
        amount += bodyItemInstance.item.equipmentPiece.wisdom;
        break;
    }
  }
  if (worldState.values.headItemInstanceID !== null) {
    const headItemInstance: ItemInstance = getDefinable(
      ItemInstance,
      worldState.values.headItemInstanceID,
    );
    switch (stat) {
      case Stat.Agility:
        amount += headItemInstance.item.equipmentPiece.agility;
        break;
      case Stat.Defense:
        amount += headItemInstance.item.equipmentPiece.defense;
        break;
      case Stat.Intelligence:
        amount += headItemInstance.item.equipmentPiece.intelligence;
        break;
      case Stat.Luck:
        amount += headItemInstance.item.equipmentPiece.luck;
        break;
      case Stat.Strength:
        amount += headItemInstance.item.equipmentPiece.strength;
        break;
      case Stat.Wisdom:
        amount += headItemInstance.item.equipmentPiece.wisdom;
        break;
    }
  }
  if (worldState.values.mainHandItemInstanceID !== null) {
    const mainHandItemInstance: ItemInstance = getDefinable(
      ItemInstance,
      worldState.values.mainHandItemInstanceID,
    );
    switch (stat) {
      case Stat.Agility:
        amount += mainHandItemInstance.item.equipmentPiece.agility;
        break;
      case Stat.Defense:
        amount += mainHandItemInstance.item.equipmentPiece.defense;
        break;
      case Stat.Intelligence:
        amount += mainHandItemInstance.item.equipmentPiece.intelligence;
        break;
      case Stat.Luck:
        amount += mainHandItemInstance.item.equipmentPiece.luck;
        break;
      case Stat.Strength:
        amount += mainHandItemInstance.item.equipmentPiece.strength;
        break;
      case Stat.Wisdom:
        amount += mainHandItemInstance.item.equipmentPiece.wisdom;
        break;
    }
  }
  if (worldState.values.offHandItemInstanceID !== null) {
    const offHandItemInstance: ItemInstance = getDefinable(
      ItemInstance,
      worldState.values.offHandItemInstanceID,
    );
    switch (stat) {
      case Stat.Agility:
        amount += offHandItemInstance.item.equipmentPiece.agility;
        break;
      case Stat.Defense:
        amount += offHandItemInstance.item.equipmentPiece.defense;
        break;
      case Stat.Intelligence:
        amount += offHandItemInstance.item.equipmentPiece.intelligence;
        break;
      case Stat.Luck:
        amount += offHandItemInstance.item.equipmentPiece.luck;
        break;
      case Stat.Strength:
        amount += offHandItemInstance.item.equipmentPiece.strength;
        break;
      case Stat.Wisdom:
        amount += offHandItemInstance.item.equipmentPiece.wisdom;
        break;
    }
  }
  for (const boostItemInstanceID of worldState.values.boostItemInstanceIDs) {
    const itemInstance: ItemInstance = getDefinable(
      ItemInstance,
      boostItemInstanceID,
    );
    const boost: Boost = itemInstance.item.ability.boost;
    if (boost.stat === stat) {
      amount += boost.amount;
    }
  }
  return amount;
};
