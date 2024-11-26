import { NPC } from "../classes/NPC";
import { getDefinable } from "definables";

export const getNPCIndicatorImagePath = (npcID: string): string => {
  const npc: NPC = getDefinable(NPC, npcID);
  if (npc.hasEncounterID()) {
    return "indicators/boss";
  }
  if (npc.hasInnCost()) {
    return "indicators/inn";
  }
  if (npc.hasShopID()) {
    return npc.shop.indicatorImagePath;
  }
  if (npc.hasDialogue()) {
    return "indicators/dialogue";
  }
  throw new Error("No indicator image path found for NPC.");
};
