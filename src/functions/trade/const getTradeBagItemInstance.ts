import { ItemInstance } from "../../classes/ItemInstance";
import { getTradeBagItemInstances } from "./getTradeBagItemInstances";

export const getTradeBagItemInstance = (i: number): ItemInstance => {
  const tradeBagItemInstances: readonly ItemInstance[] =
    getTradeBagItemInstances();
  const tradeBagItemInstance: ItemInstance | undefined =
    tradeBagItemInstances[i];
  if (typeof tradeBagItemInstance === "undefined") {
    throw new Error("Trade bag item instance not found");
  }
  return tradeBagItemInstance;
};
